// Strong password policy: min 8 chars, with at least one uppercase letter,
// one lowercase letter, one number and one symbol.
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const PASSWORD_RULES_MESSAGE =
  "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a symbol";

export const isStrongPassword = (password: unknown): password is string =>
  typeof password === "string" && PASSWORD_REGEX.test(password);
