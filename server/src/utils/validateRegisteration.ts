export const validateRegisteration = (username: string, email: string, password: string) => {
  if (username.length <= 2) {
    return {
      user: null,
      error: {
        code: "INVALID_USERNAME",
        field: "username",
        message: "Length must be greater than 2.",
      },
    };
  }

  if (username.includes('@')) {
    return {
      user: null,
      error: {
        code: "INVALID_USERNAME",
        field: "username",
        message: "Cannot include @.",
      },
    };
  }

  if (!email.includes("@")) {
    return {
      user: null,
      error: {
        code: "INVALID_EMAIL",
        field: "email",
        message: "Invalid email.",
      },
    };
  }

  if (password.length <= 2) {
    return {
      user: null,
      error: {
        code: "INVALID_PASSWORD",
        field: "password",
        message: "Length must be greater than 2.",
      },
    };
  }

  return null;
};
