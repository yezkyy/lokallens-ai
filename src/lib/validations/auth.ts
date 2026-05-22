import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  businessName: z.string().min(3, { message: "Nama bisnis minimal 3 karakter" }),
  ownerName: z.string().min(3, { message: "Nama pemilik minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
  city: z.string().min(2, { message: "Kota wajib diisi" }),
  phoneNumber: z.string().min(10, { message: "No. HP minimal 10 digit" }),
  businessCategory: z.string().min(2, { message: "Kategori wajib diisi" }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
