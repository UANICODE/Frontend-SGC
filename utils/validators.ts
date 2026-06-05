// utils/validators.ts
export const validateLogin = (email: string, password: string) => {
  const errors: { email?: string; password?: string } = {};

  if (!email.trim()) {
    errors.email = "O email é obrigatório";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    errors.email = "Email inválido";
  }

  if (!password.trim()) {
    errors.password = "A senha é obrigatória";
  }

  return errors;
};