# files-storage

Demo: https://files-storage.onrender.com/

To test it out you can register or use the credentials:

- email: filesstorage@gmail.com
- password: 4Testing&
  <br/><br/>

With file-storage you can upload and store your images, documents or any other types of files in a virtual storage. The application provides convenient dashboard to manage single file as well ad multiple files. A user can copy, download, rename, delete a file, filter and sort files, change layout form grid to list.
<br/><br/>

Unauthenticated user have access only to public files.
The user can register and create his own private storage. Authenticated user have access to both public and private storage and can switch between them.
<br/><br/>

The application is fully **accessible** so the user can use a keyboard to perform any action.
<br/><br/>

# Preview

// add a video?

# Technologies

HTML5, CSS, SCSS, JavaScript(ES6), TypeScript, Nuxt3, Supabase
<br/><br/>

**Nuxt3** - composition API, composables, api routes, ssr, middleware
<br/><br/>

**Supabase** - storage, authentication, database.

The application uses two storages:

- public - full access for unauthenticated and authenticated user.
- private - access only for authenticated users. The user have only access to a folder which name is equal to the user id.

Database is used to store a nme of user profile photo (if set on /your-profile page).
<br/><br/>

# Setup

## Supabase

Create a Supabase project.

Storage - create storages:

- files - mark as a public storage, allow all the users to perform actions: select, insert, update, delete.
- private - mark as a private storage. Give users access to only their own a top level folder named as their id.

Authentication:
Provider - enabale email provider.

Database:

- in the public schema create profiles table with id and avatar fields.
  <br/><br/>

## Nuxt3

Make sure to install the dependencies:

```bash
# npm
npm install
```

Start the development server on http://localhost:3000

```bash
npm run dev
```
