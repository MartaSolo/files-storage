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