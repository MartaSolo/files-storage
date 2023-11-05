export const validation = {
  nameError:
    "Name should be at least 2 characters long and contain only letters",
  nameRegex: /^(?!.* .* )[a-zA-Z ]{2,25}$/,
  emailError: "Please enter valid email address",
  emailRegex:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  passwordError: "Please enter valid password",
  passwordRegex:
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
};
