# Docker Setup

Reference: [Running Nuxt 3 in a Docker Container](https://markus.oberlehner.net/blog/running-nuxt-3-in-a-docker-container)

---

## Why Docker only, not Docker Compose?

**Docker** = a single container. You write a `Dockerfile` that describes how to build and run one app. You start it with `docker run ...`.

**Docker Compose** = a tool to run _multiple_ containers together (e.g. app + database + cache). You write a `docker-compose.yml` that lists all services and their config. You start everything with `docker compose up`.

This project has one service — the Nuxt server. Supabase is hosted remotely, so there is no local database to spin up. Docker Compose would be the right choice if you were running Supabase locally too, but that is a much heavier setup.

Docker Compose _can_ be added for convenience even with one service (it lets you replace the long `docker run` command with just `docker compose up`), but for a portfolio project the plain Dockerfiles are simpler and easier for anyone reading the repo to understand.

**Verdict: `Dockerfile` + `Dockerfile.dev` is enough.**

---

## Files

### [`Dockerfile`](Dockerfile) — production

```dockerfile
# syntax=docker/dockerfile:1
ARG NODE_VERSION=18.14.0

# full image — has Python + build tools needed for native modules
FROM node:${NODE_VERSION} AS base
ARG PORT=3000
WORKDIR /src

FROM base AS build
COPY --link package.json package-lock.json .
RUN npm install
COPY --link . .
RUN npm run build

# slim is fine for the run stage — no compiling needed
FROM node:${NODE_VERSION}-slim AS runner
ARG PORT=3000
ENV PORT=$PORT
ENV NODE_ENV=production
WORKDIR /src
COPY --from=build /src/.output /src/.output
CMD ["node", ".output/server/index.mjs"]
```

### [`Dockerfile.dev`](Dockerfile.dev) — development

```dockerfile
# syntax=docker/dockerfile:1
ARG NODE_VERSION=18.14.0

# full image — has Python + build tools needed for native modules
FROM node:${NODE_VERSION} AS base
ENV NODE_ENV=development
WORKDIR /src

FROM base AS build
COPY --link package.json package-lock.json .
RUN npm install

FROM base
COPY --from=build /src/node_modules /src/node_modules
EXPOSE 3000
EXPOSE 24678
CMD ["npm", "run", "dev"]
```

### [`.dockerignore`](.dockerignore)

```
/node_modules
/.output
/.nuxt
.env
*.log
README.md
```

### [`nuxt.config.ts`](nuxt.config.ts) — patch

Add `server.watch` inside the existing `vite` block:

```ts
vite: {
  server: {
    watch: {
      usePolling: true,
    },
  },
  css: { ... }, // existing config stays
},
```

### [`.env`](.env) — no quotes

Docker's `--env-file` does **not** strip quotes from values — unlike `dotenv` (used by `npm run dev`) which does. If your `.env` has `SUPABASE_URL="https://..."`, Docker passes the quotes as part of the value, making the URL invalid.

Values must be unquoted:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_key
```

---

## Explanations

### `Dockerfile` — stage by stage

```dockerfile
# syntax=docker/dockerfile:1
```

Opts in to the modern BuildKit syntax. Enables features like `--link` and better caching.

```dockerfile
ARG NODE_VERSION=18.14.0
```

Defines a build-time variable for the Node version. Matches `.nvmrc`. Set once at the top — available in all `FROM` instructions throughout the file.

---

**Stage 1 — `base`**

```dockerfile
FROM node:${NODE_VERSION} AS base
ARG PORT=3000
WORKDIR /src
```

- `FROM node:${NODE_VERSION}` — the **full** Debian-based Node image. Used here (not `slim`) because the build stage needs Python and C++ build tools to compile native Node packages (e.g. `bufferutil`). `slim` strips those tools out.
- `ARG PORT=3000` — a build-time variable for the port, defaulting to 3000. Re-declared in the `runner` stage to make it available there.
- `WORKDIR /src` — sets the working directory inside the container.
- This stage is not run directly — it exists as a shared base for the `build` stage.

---

**Stage 2 — `build`**

```dockerfile
FROM base AS build
COPY --link package.json package-lock.json .
RUN npm install
COPY --link . .
RUN npm run build
```

- `FROM base AS build` — inherits from `base` (full image with build tools).
- `COPY --link package.json package-lock.json .` — copies only the dependency files first. `--link` improves caching.
- `RUN npm install` — Docker caches this layer and only re-runs it when `package.json` or `package-lock.json` change — not on every code edit.
- `COPY --link . .` — copies the rest of the source code.
- `RUN npm run build` — produces `.output/`: a self-contained Node server.

---

**Stage 3 — `runner` (final image)**

```dockerfile
FROM node:${NODE_VERSION}-slim AS runner
ARG PORT=3000
ENV PORT=$PORT
ENV NODE_ENV=production
WORKDIR /src
COPY --from=build /src/.output /src/.output
CMD ["node", ".output/server/index.mjs"]
```

- `FROM node:${NODE_VERSION}-slim AS runner` — starts **fresh** from the small `slim` image. No source code, no `node_modules`, no build tools. The run stage only needs to run the compiled `.output/` — no native compilation happens here.
- `ARG PORT=3000` — re-declared because `ARG` does not carry over between stages that don't share a `FROM`.
- `ENV PORT=$PORT` — converts the build-time ARG into a runtime env var.
- `ENV NODE_ENV=production` — production mode.
- `WORKDIR /src` — also re-declared since this is a fresh `FROM`, not inheriting from `base`.
- `COPY --from=build /src/.output` — only the compiled output is copied in. Final image is lean.

---

### `Dockerfile.dev` — stage by stage

```dockerfile
# syntax=docker/dockerfile:1
ARG NODE_VERSION=18.14.0
```

Same as above.

---

**Stage 1 — `base`**

```dockerfile
FROM node:${NODE_VERSION} AS base
ENV NODE_ENV=development
WORKDIR /src
```

- Full image throughout (not `slim`) — both `base` and the run stage need the build tools available because `node_modules` (including native binaries) will be used at runtime.
- `ENV NODE_ENV=development` — enables Nuxt/Vite devtools and detailed errors.

---

**Stage 2 — `build`**

```dockerfile
FROM base AS build
COPY --link package.json package-lock.json .
RUN npm install
```

- Runs `npm install` inside a Linux environment, producing Linux-compatible `node_modules`.
- Source code is deliberately **not** copied — it will be provided by a bind mount at runtime.
- This is the key reason for a build stage: `node_modules` compiled on macOS (Apple Silicon = arm64 darwin) is incompatible with Linux inside the container. The two platforms compile native binaries differently (e.g. `esbuild` ships as `@esbuild/darwin-arm64` on Mac vs `@esbuild/linux-arm64` in the container).

---

**Stage 3 — run (final image)**

```dockerfile
FROM base
COPY --from=build /src/node_modules /src/node_modules
EXPOSE 3000
EXPOSE 24678
CMD ["npm", "run", "dev"]
```

- `COPY --from=build /src/node_modules` — copies the Linux-compatible `node_modules` into the image. This is then protected from the bind mount by the anonymous volume in `docker run` (see below).
- `EXPOSE 3000` / `EXPOSE 24678` — documents the ports. Does not publish them — that is done with `-p` in `docker run`. Port 24678 is Vite's WebSocket port for HMR — without mapping it, the page loads but changes never appear in the browser.
- `CMD ["npm", "run", "dev"]` — starts the Nuxt dev server with HMR.

---

### Why `usePolling: true` in nuxt.config.ts?

Vite detects file changes via OS filesystem events (`inotify` on Linux). On macOS and Windows those events are not forwarded through Docker bind mounts into the container. Without polling, saving a `.vue` file on your Mac triggers nothing inside the container — no HMR. `usePolling: true` tells Vite to check files on a timer instead. Slight CPU overhead but works reliably on all platforms.

---

## Build and run

### Production

```bash
docker build -t files-storage .
```

- `docker build` — reads the `Dockerfile` and builds an image
- `-t files-storage` — tags (names) the image so you can reference it by name instead of a random ID
- `.` — the build context: tells Docker to look for the `Dockerfile` in the current directory and send the local files into the build process (`.dockerignore` controls what gets excluded)

```bash
docker run -p 3000:3000 --env-file .env files-storage
```

- `docker run` — creates and starts a container from the image
- `-p 3000:3000` — publishes port 3000 from inside the container to port 3000 on your Mac. Format is `host:container`
- `--env-file .env` — reads your `.env` file and injects `SUPABASE_URL` and `SUPABASE_KEY` into the container at runtime. The file is never baked into the image
- `files-storage` — the name of the image to run

Open http://localhost:3000.

---

### Development (with live reload)

```bash
docker build -f Dockerfile.dev -t files-storage-dev .
```

- `-f Dockerfile.dev` — tells Docker to use `Dockerfile.dev` instead of the default `Dockerfile`
- `-t files-storage-dev` — tags the image as `files-storage-dev` to keep it separate from the production image

```bash
docker run -p 3000:3000 -p 24678:24678 --env-file .env \
  -v $(pwd):/src \
  -v /src/node_modules \
  files-storage-dev
```

- `-p 24678:24678` — maps Vite's WebSocket port for HMR. Without this, the page loads but changes never appear in the browser
- `-v $(pwd):/src` — **bind mount**: mounts your current local directory into `/src` inside the container. Every file you save on your Mac is instantly visible inside the container — this enables live reload without rebuilding
- `-v /src/node_modules` — **anonymous volume**: shields the `/src/node_modules` path from being overwritten by the bind mount above. Docker initialises this volume from the image's data (the Linux `node_modules` copied in the build stage). Without this flag, the bind mount would replace Linux `node_modules` with macOS ones, causing native module errors (e.g. `@esbuild/darwin-arm64` found but `@esbuild/linux-arm64` needed)

Open http://localhost:3000. Source code changes are picked up automatically and the browser hot-reloads.

---

## Stopping and cleaning up

### Stop the container temporarily

Press `Ctrl+C` in the terminal where the container is running. This stops the container but keeps it (and its anonymous volumes) around.

To start it again without rebuilding:

```bash
docker start $(docker ps -aq --filter ancestor=files-storage-dev)
```

Or just run the full `docker run ...` command again — each `docker run` creates a fresh container.

---

### Remove a container

List all containers (including stopped ones):

```bash
docker ps -a
```

Remove a specific container by ID or name:

```bash
docker rm <container_id>
```

Remove all stopped containers at once:

```bash
docker container prune
```

---

### Full clean — rebuild from scratch

If you want to remove everything and start fresh (container + its anonymous volumes + the image):

```bash
# 1. Stop and remove the container and its anonymous volumes (-v flag removes volumes tied to it)
docker rm -v $(docker ps -aq --filter ancestor=files-storage-dev)

# 2. Remove the image
docker rmi files-storage-dev

# 3. Rebuild the image
docker build -f Dockerfile.dev -t files-storage-dev .

# 4. Run fresh
docker run -p 3000:3000 -p 24678:24678 --env-file .env \
  -v $(pwd):/src \
  -v /src/node_modules \
  files-storage-dev
```

The `-v` flag on `docker rm` removes the anonymous volumes tied to that container (including the `/src/node_modules` one). This is important when you want a clean reinstall — otherwise the old volume persists and the new image's `node_modules` won't be used.

---

### Nuclear option — clean everything Docker-related

```bash
docker system prune -a
```

Removes all stopped containers, unused images, unused networks, and build cache. Use this when you want to reclaim disk space or reset Docker completely. It will not affect running containers.

---

## When to rebuild

| Situation                                                | Action                                                                          |
| -------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Changed source code (`.vue`, `.ts`, pages, composables…) | **Nothing** — bind mount reflects changes instantly, HMR reloads the browser    |
| Added or updated a dependency in `package.json`          | Rebuild: `docker build -f Dockerfile.dev -t files-storage-dev .` then run again |
| Changed `.env` values                                    | Stop and `docker run ...` again — no rebuild needed                             |
| Testing the production build                             | Use the production `Dockerfile`                                                 |
