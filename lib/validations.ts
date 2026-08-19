import { z } from "zod";

export const userIdSchema = z.enum(["you", "her"]);

export const bookStatusSchema = z.enum(["reading", "finished", "want-to-read"]);

export const bookCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author is required"),
  coverUrl: z.string().trim().optional().or(z.literal("")),
  status: bookStatusSchema.optional().default("want-to-read"),
  rating: z.number().min(0).max(5).optional().default(0),
  notes: z.string().trim().optional().default(""),
  owner: userIdSchema,
});

export const bookUpdateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  author: z.string().trim().min(1).optional(),
  coverUrl: z.string().trim().optional().or(z.literal("")).nullable(),
  status: bookStatusSchema.optional(),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().trim().optional(),
});

export const checkinCreateSchema = z.object({
  userId: userIdSchema,
});

export const checkinMonthQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format")
    .optional()
    .nullable(),
});

export const recCreateSchema = z.object({
  from: userIdSchema,
  to: userIdSchema,
  bookTitle: z.string().trim().min(1, "Book title is required"),
  bookAuthor: z.string().trim().min(1, "Book author is required"),
  note: z.string().trim().optional().default(""),
});

export const coversQuerySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author is required"),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().min(2, "Search query must be at least 2 characters"),
});
