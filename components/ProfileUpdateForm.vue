<script setup lang="ts">
const user = useSupabaseUser();

const { validateName, handleNameInput, nameError } = useValidateName();
const { validateEmail, handleEmailInput, emailError } = useValidateEmail();
const { validatePassword, handlePasswordInput, passwordError } =
  useValidatePassword();

const {
  updateName,
  updateEmail,
  updatePassword,
  updateUserError,
  updateUserSuccess,
} = useUpdateUser();

const editName = ref(false);
const editEmail = ref(false);
const editPassword = ref(false);
const newName = ref("");
const newEmail = ref("");
const newPassword = ref("");
const passwordInputType = ref("password");

const validationClasses = (error: string, inputValue: string) => {
  return [error ? "error" : "", inputValue && !error ? "success" : ""];
};

const toggleEditName = () => {
  if (editName.value) {
    hideNameInput();
  } else {
    editName.value = true;
  }
};

const toggleEditEmail = () => {
  if (editEmail.value) {
    hideEmailInput();
  } else {
    editEmail.value = true;
  }
};

const toggleEditPassword = () => {
  if (editPassword.value) {
    hidePasswordInput();
  } else {
    editPassword.value = true;
  }
};

const hideNameInput = () => {
  editName.value = false;
  nameError.value = "";
  newName.value = "";
};

const hideEmailInput = () => {
  editEmail.value = false;
  emailError.value = "";
  newEmail.value = "";
};

const hidePasswordInput = () => {
  editPassword.value = false;
  passwordError.value = "";
  newPassword.value = "";
};

const toggleShowPassword = () => {
  return passwordInputType.value === "password"
    ? (passwordInputType.value = "text")
    : (passwordInputType.value = "password");
};

const resetFormMessages = () => {
  updateUserError.value = "";
  updateUserSuccess.value = "";
};

const onUpdateName = async (name: string) => {
  resetFormMessages();
  await updateName(name);
  if (!updateUserError.value) editName.value = false;
};

const onUpdateEmail = async (email: string) => {
  resetFormMessages();
  await updateEmail(email);
  if (!updateUserError.value) editEmail.value = false;
};

const onUpdatePassword = async (password: string) => {
  resetFormMessages();
  await updatePassword(password);
  if (!updateUserError.value) editPassword.value = false;
};
</script>

<template>
  <form class="profile__form">
    <div class="profile__info">
      <span class="profile__info--name">Name</span>
      <div class="profile__info--data">
        <p class="profile__info--user">
          {{ user.user_metadata.first_name }}
        </p>
        <IconButton
          description="Edit name"
          theme="white"
          type="button"
          @click="toggleEditName"
        >
          <template #icon>
            <EditIcon />
          </template>
        </IconButton>
      </div>
      <Transition name="slide">
        <div v-if="editName" class="profile__info--edit">
          <BaseInput
            v-model.trim="newName"
            name="new-name"
            class="profile__info--input"
            :class="validationClasses(nameError, newName)"
            placeholder="New name"
            @input="handleNameInput"
            @blur="validateName(newName)"
          />
          <span v-if="nameError" class="profile__error">{{ nameError }}</span>
          <div class="profile__info--actions">
            <BaseButton
              class="profile__info--button"
              theme="white"
              type="button"
              @click="hideNameInput"
              >Cancel</BaseButton
            >
            <BaseButton
              class="profile__info--button"
              theme="light-green"
              type="button"
              @click="onUpdateName(newName)"
              >Update</BaseButton
            >
          </div>
        </div>
      </Transition>
    </div>
    <div class="profile__info">
      <span class="profile__info--name">Email</span>
      <div class="profile__info--data">
        <p class="profile__info--user">{{ user.email }}</p>
        <IconButton
          description="Edit email"
          theme="white"
          type="button"
          @click="toggleEditEmail"
        >
          <template #icon>
            <EditIcon />
          </template>
        </IconButton>
      </div>
      <Transition name="slide">
        <div v-if="editEmail" class="profile__info--edit">
          <BaseInput
            v-model.trim="newEmail"
            name="new-email"
            class="profile__info--input"
            :class="validationClasses(emailError, newEmail)"
            placeholder="email@email.com"
            @input="handleEmailInput"
            @blur="validateEmail(newEmail)"
          />
          <span v-if="emailError" class="profile__error">{{ emailError }}</span>
          <div class="profile__info--actions">
            <BaseButton
              class="profile__info--button"
              theme="white"
              type="button"
              @click="hideEmailInput"
              >Cancel</BaseButton
            >
            <BaseButton
              class="profile__info--button"
              theme="light-green"
              type="button"
              @click="onUpdateEmail(newEmail)"
              >Update</BaseButton
            >
          </div>
        </div>
      </Transition>
    </div>
    <div class="profile__info">
      <span class="profile__info--name">Password</span>
      <div class="profile__info--data">
        <p class="profile__info--user">**********</p>
        <IconButton
          description="Edit email"
          theme="white"
          type="button"
          @click="toggleEditPassword"
        >
          <template #icon>
            <EditIcon />
          </template>
        </IconButton>
      </div>
      <Transition name="slide">
        <div v-if="editPassword" class="profile__info--edit">
          <BaseAccordion
            title="Password hint"
            content="Password must consist of 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."
          >
          </BaseAccordion>
          <BaseInput
            v-model.trim="newPassword"
            name="new-password"
            class="profile__info--input"
            :class="validationClasses(passwordError, newPassword)"
            :type="passwordInputType"
            placeholder="New password"
            @input="handlePasswordInput"
            @blur="validatePassword(newPassword)"
            ><button
              type="button"
              class="profile__password--button"
              @click="toggleShowPassword"
            >
              <EyeIcon /></button
          ></BaseInput>
          <span v-if="passwordError" class="profile__error">{{
            passwordError
          }}</span>
          <div class="profile__info--actions">
            <BaseButton
              class="profile__info--button"
              theme="white"
              type="button"
              @click="hidePasswordInput"
              >Cancel</BaseButton
            >
            <BaseButton
              class="profile__info--button"
              theme="light-green"
              type="button"
              @click="onUpdatePassword(newPassword)"
              >Update</BaseButton
            >
          </div>
        </div>
      </Transition>
    </div>
    <div class="profile__update">
      <BaseNotification v-if="updateUserError" theme="error">{{
        updateUserError
      }}</BaseNotification>
      <BaseNotification v-if="updateUserSuccess" theme="success">{{
        updateUserSuccess
      }}</BaseNotification>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.profile__form {
  @include mediumScreen {
    flex-basis: 50%;
  }
}

.profile__info {
  margin-bottom: 2rem;
}

.profile__info--name {
  display: inline-block;
  padding: 0 0 0.5rem 0.5rem;
  color: $text-color-secondary;
  font-size: 0.8rem;
}

.profile__info--data {
  border-bottom: 1px solid $color-grey-light;
  display: flex;
  margin-bottom: 1rem;
}

.profile__info--user {
  flex-grow: 1;
  padding: 0.5rem 0.75rem;
}

.profile__info--input {
  padding-bottom: 1.5rem;
  position: relative;
}

.error.profile__info--input {
  padding-bottom: 0;
}

.profile__password--button {
  position: absolute;
  right: 5px;
}

.profile__info--actions {
  display: flex;
  justify-content: space-around;
}

.profile__info--button {
  font-size: 0.8rem;
  padding: 0.25rem;
  min-width: 70px;
}

.profile__error {
  font-size: 0.8rem;
  color: $text-color-error;
  line-height: 1.2;
  display: block;
  padding: 0.2rem 0.6rem 0.3rem 0.5rem;
}

.profile__photo {
  background-color: palegreen;
  @include mediumScreen {
    flex-basis: 50%;
  }
}

.slide-enter-active {
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
