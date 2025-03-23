export const validation = {
  name: {
    regex:
      /^[a-zA-ZÀ-ÿ]+([-']?[a-zA-ZÀ-ÿ]+)*( [a-zA-ZÀ-ÿ]+([-']?[a-zA-ZÀ-ÿ]+)*)*$/,
    minChar: 2,
    maxChar: 50,
    error: {
      tooShort: "Name must be at least 2 characters long",
      tooLong: "Name cannot be longer than 50 characters",
      invalid:
        "Name can only contain letters, hyphens, apostrophes and single spaces",
      empty: "Name is required",
    },
  },
  email: {
    regex:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    error: {
      invalid: "Please enter valid email address",
      empty: "Email is required",
    },
  },
  password: {
    regex: {
      digit: /\d/,
      lowerCase: /[a-z]/,
      upperCase: /[A-Z]/,
      specialChar: /[^a-zA-Z0-9]/,
      noSpace: /^\S*$/,
    },
    minChar: 8,
    maxChar: 15,
    error: {
      tooShort: "Password must be at least 8 characters long",
      tooLong: "Password cannot be longer than 15 characters",
      noDigit: "Password must contain at least one digit",
      noLowerCase: "Password must contain at least one lowercase letter",
      noUpperCase: "Password must contain at least one uppercase letter",
      noSpecialChar: "Password must contain at least one special character",
      containsSpace: "Password cannot contain spaces",
      empty: "Password is required",
    },
  },
};
