export default defineNuxtPlugin(() => {
  const user = useSupabaseUser();
  const isStoragePublic = useIsStoragePublic();

  // Initial value (runs on server and client, before any component):
  // logged in -> private storage, logged out -> public storage only
  isStoragePublic.value = !user.value?.sub;

  // Client only: reset the mode on a login/logout, so the user's manual
  // public/private toggle is not overwritten by token refreshes
  if (import.meta.client) {
    watch(
      () => user.value?.sub,
      (sub) => {
        isStoragePublic.value = !sub;
      }
    );
  }
});
