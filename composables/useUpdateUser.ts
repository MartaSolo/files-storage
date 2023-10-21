export const useUpdateUser = () => {
  const client = useSupabaseClient();

  const updateUserError = ref("");
  const updateUserSuccess = ref("");

  const updateName = async (newName: string) => {
    const { data, error } = await client.auth.updateUser({
      data: { first_name: newName },
    });

    if (error) {
      updateUserError.value = error.message;
    }
    updateUserSuccess.value = "Your name have been successfully updated.";
    return data;
  };

  const updateEmail = async (newEmail: string) => {
    const { data, error } = await client.auth.updateUser({ email: newEmail });

    if (error) {
      updateUserError.value = error.message;
    }
    updateUserSuccess.value =
      "Please check your mailbox, we have just sent an email with confirmation link.";
    return data;
  };

  const updatePassword = async (newPassword: string) => {
    const { data, error } = await client.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      updateUserError.value = error.message;
    }
    updateUserSuccess.value = "Your password have been successfully updated.";
    return data;
  };

  return {
    updateName,
    updateEmail,
    updatePassword,
    updateUserError,
    updateUserSuccess,
  };
};
