import { z } from 'zod';

const validateGmailEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.toLowerCase().endsWith('@gmail.com');
};

export const registerSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  sponsor_id: z.string().optional(),
  ref_id: z.string().optional(),
  hasSponsor: z.boolean(),
  acceptTerms: z.boolean().refine(val => val, { message: 'You must accept the terms.' }),
  email: z.string()
    .min(1, 'Email is required')
    .refine(validateGmailEmail, 'Please enter a valid Gmail address (e.g., user@gmail.com)'),
  email_confirmation: z.string()
    .min(1, 'Confirm email is required')
    .refine(validateGmailEmail, 'Please enter a valid Gmail address (e.g., user@gmail.com)'),
  country_id: z.string().min(1, 'Country is required'),
  otp: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
  mobile: z.string().min(10, 'Phone number is required'),
  qrCode: z.string().optional(),
  secret: z.string().optional(),
  user_type: z.string().optional(),
  plan_id: z.number().optional(),
  dial_code: z.string().optional(),
}).refine((data) => data.email === data.email_confirmation, {
  message: "Emails do not match",
  path: ["email_confirmation"],
});

export type RegisterFormType = z.infer<typeof registerSchema>; 