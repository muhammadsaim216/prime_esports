import * as z from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address")
      .max(255, "Email must be less than 255 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(72, "Password must be less than 72 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    discord: z
      .string()
      .max(50, "Discord tag must be less than 50 characters")
      .optional()
      .or(z.literal("")),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile schemas
export const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  discord_id: z
    .string()
    .max(50, "Discord tag must be less than 50 characters")
    .optional()
    .or(z.literal("")),
});

// Scrim application schema
export const scrimApplicationSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

// Tryout application schema
export const tryoutApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  discord: z
    .string()
    .trim()
    .min(1, "Discord tag is required")
    .max(50, "Discord tag must be less than 50 characters"),
  age: z
    .string()
    .min(1, "Age is required")
    .refine((val) => parseInt(val) >= 16, "You must be at least 16 years old"),
  country: z
    .string()
    .trim()
    .min(1, "Country is required")
    .max(100, "Country must be less than 100 characters"),
  currentRank: z
    .string()
    .trim()
    .min(1, "Current rank is required")
    .max(100, "Rank must be less than 100 characters"),
  peakRank: z
    .string()
    .trim()
    .min(1, "Peak rank is required")
    .max(100, "Rank must be less than 100 characters"),
  hoursPerWeek: z.string().min(1, "Please select hours available"),
  previousTeams: z
    .string()
    .max(500, "Previous teams must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  achievements: z
    .string()
    .max(500, "Achievements must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  whyJoin: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters")
    .max(1000, "Motivation must be less than 1000 characters"),
  availability: z.array(z.string()).min(1, "Please select at least one availability slot"),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

// Admin schemas
export const announcementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(5000, "Content must be less than 5000 characters"),
});

export const scrimSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
  game: z.string().min(1, "Game is required"),
  scheduled_at: z.string().min(1, "Schedule date is required"),
  max_players: z
    .number()
    .min(2, "Minimum 2 players")
    .max(100, "Maximum 100 players"),
  is_paid: z.boolean(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  status: z.enum(["upcoming", "live", "completed", "cancelled"]),
});

export const teamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Team name is required")
    .max(100, "Team name must be less than 100 characters"),
  game: z.string().min(1, "Game is required"),
  category: z.string().min(1, "Category is required"),
  logo: z.string().optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export const tryoutSchema = z.object({
  team_name: z
    .string()
    .trim()
    .min(1, "Team name is required")
    .max(100, "Team name must be less than 100 characters"),
  game: z.string().min(1, "Game is required"),
  position: z
    .string()
    .trim()
    .min(1, "Position is required")
    .max(100, "Position must be less than 100 characters"),
  requirements: z
    .string()
    .max(500, "Requirements must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
  deadline: z.string().min(1, "Deadline is required"),
  status: z.enum(["open", "closing_soon", "closed"]),
});

export const newsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  excerpt: z
    .string()
    .max(300, "Excerpt must be less than 300 characters")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10000 characters"),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const streamSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  stream_type: z.enum(["direct", "third_party"]),
  embed_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  thumbnail_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  scrim_id: z.string().uuid().optional().or(z.literal("")),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ScrimApplicationFormData = z.infer<typeof scrimApplicationSchema>;
export type TryoutApplicationFormData = z.infer<typeof tryoutApplicationSchema>;
export type AnnouncementFormData = z.infer<typeof announcementSchema>;
export type ScrimFormData = z.infer<typeof scrimSchema>;
export type TeamFormData = z.infer<typeof teamSchema>;
export type TryoutFormData = z.infer<typeof tryoutSchema>;
export type NewsFormData = z.infer<typeof newsSchema>;
export type StreamFormData = z.infer<typeof streamSchema>;
