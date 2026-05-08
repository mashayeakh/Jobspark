import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const createSubCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const updateSubCategorySchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export interface CreateCategoryDto {
  name: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CreateSubCategoryDto {
  name: string;
  categoryId: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateSubCategoryDto {
  name?: string;
  categoryId?: string;
  isActive?: boolean;
  sortOrder?: number;
}
