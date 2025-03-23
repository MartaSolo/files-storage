<template>
  <form class="profile__form">
    <div class="profile__info">
      <span class="profile__name">Name</span>
      <div class="profile__data">
        <p class="profile__user">
          {{ user?.user_metadata.first_name }}
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
            v-model.trim="name"
            name="new-name"
            class="profile__input"
            placeholder="New name"
            :error-message="nameError"
            :valid="nameSuccess"
            @blur="nameTouched = true"
          />
          <div class="profile__actions">
            <BaseButton
              class="profile__info--button"
              theme="white"
              size="small"
              @click="hideNameInput"
            >
              Cancel
            </BaseButton>
            <BaseButton
              class="profile__info--button"
              theme="light-green"
              size="small"
              @click="onUpdateName(name)"
            >
              Update
            </BaseButton>
          </div>
        </div>
      </Transition>
    </div>
    <div class="profile__info">
      <span class="profile__name">Email</span>
      <div class="profile__data">
        <p class="profile__user">{{ user?.email }}</p>
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
            v-model.trim="email"
            name="new-email"
            class="profile__input"
            placeholder="email@email.com"
            :error-message="emailError"
            :valid="emailSuccess"
            @blur="emailTouched = true"
          />
          <div class="profile__actions">
            <BaseButton
              class="profile__info--button"
              theme="white"
              size="small"
              @click="hideEmailInput"
            >
              Cancel
            </BaseButton>
            <BaseButton
              class="profile__info--button"
              theme="light-green"
              size="small"
              @click="onUpdateEmail(email)"
            >
              Update
            </BaseButton>
          </div>
        </div>
      </Transition>
    </div>
    <div class="profile__info">
      <span class="profile__name">Password</span>
      <div class="profile__data">
        <p class="profile__user">**********</p>
        <IconButton
          description="Edit password"
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
            v-model.trim="password"
            name="new-password"
            class="profile__input"
            :type="passwordInputType"
            placeholder="New password"
            :error-message="passwordError"
            :valid="passwordSuccess"
            @blur="passwordTouched = true"
            ><button
              type="button"
              class="profile__icon"
              @click="toggleShowPassword"
            >
              <EyeIcon /></button
          ></BaseInput>
          <div class="profile__actions">
            <BaseButton
              class="profile__info--button"
              theme="white"
              size="small"
              @click="hidePasswordInput"
            >
              Cancel
            </BaseButton>
            <BaseButton
              class="profile__info--button"
              theme="light-green"
              size="small"
              @click="onUpdatePassword(password)"
            >
              Update
            </BaseButton>
          </div>
        </div>
      </Transition>
    </div>
  </form>
</template>

<script setup lang="ts">
const user = useSupabaseUser();

const { name, nameError, nameSuccess, nameTouched, isNameValid } =
  useValidateName();

const { email, emailTouched, emailError, emailSuccess, isEmailValid } =
  useValidateEmail();

const {
  password,
  passwordTouched,
  passwordError,
  passwordSuccess,
  isPasswordValid,
} = useValidatePassword();

const {
  updateName,
  updateEmail,
  updatePassword,
  updateUserError,
  updateUserSuccess,
} = useUpdateUser();

const { notify } = useNotification();

const editName = ref(false);
const editEmail = ref(false);
const editPassword = ref(false);
const passwordInputType = ref("password");

const toggleEditName = () => {
  editName.value ? hideNameInput() : (editName.value = true);
};

const toggleEditEmail = () => {
  editEmail.value ? hideEmailInput() : (editEmail.value = true);
};

const toggleEditPassword = () => {
  editPassword.value ? hidePasswordInput() : (editPassword.value = true);
};

const hideNameInput = () => {
  editName.value = false;
  nameError.value = "";
  name.value = "";
  nameTouched.value = false;
};

const hideEmailInput = () => {
  editEmail.value = false;
  emailError.value = "";
  email.value = "";
  emailTouched.value = false;
};

const hidePasswordInput = () => {
  editPassword.value = false;
  passwordError.value = "";
  password.value = "";
  passwordTouched.value = false;
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

const showNotification = () => {
  updateUserError.value
    ? notify("error", updateUserError.value)
    : notify("success", updateUserSuccess.value);
};

const onUpdateName = async (name: string) => {
  if (!isNameValid.value) return;
  resetFormMessages();
  await updateName(name);
  if (!updateUserError.value) hideNameInput();
  showNotification();
};

const onUpdateEmail = async (email: string) => {
  if (!isEmailValid.value) return;
  resetFormMessages();
  await updateEmail(email);
  if (!updateUserError.value) hideEmailInput();
  showNotification();
};

const onUpdatePassword = async (password: string) => {
  if (!isPasswordValid.value) return;
  resetFormMessages();
  await updatePassword(password);
  if (!updateUserError.value) hidePasswordInput();
  showNotification();
};
</script>

<style lang="scss" scoped>
.profile {
  &__form {
    @include mediumScreen {
      flex-basis: 50%;
    }
  }

  &__info {
    margin-bottom: 2rem;
  }

  &__name {
    display: inline-block;
    padding: 0 0 0.5rem 0.5rem;
    color: $text-color-secondary;
    font-size: 0.8rem;
  }

  &__data {
    border-bottom: 1px solid $color-grey-light;
    display: flex;
    margin-bottom: 1rem;
  }

  &__user {
    flex-grow: 1;
    padding: 0.5rem 0.75rem;
  }

  &__input {
    position: relative;
  }

  &__actions {
    display: flex;
    justify-content: space-around;
  }

  &__icon {
    position: absolute;
    right: 5px;
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
