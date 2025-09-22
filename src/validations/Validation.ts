export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.toLowerCase().endsWith('@gmail.com');
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

export function validateConfirmEmail(confirmEmail: string, email: string): boolean {
  return confirmEmail === email && validateEmail(confirmEmail);
} 





export function validateTID(tid: string): boolean {
  return /^\d{4}$/.test(tid);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateTwoFaCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export function isLatinOnly(text: string): boolean {
  return /^[A-Za-z0-9]*$/.test(text);
} 