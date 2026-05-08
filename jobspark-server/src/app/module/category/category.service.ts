import { prisma } from "@/app/lib/prisma";
import { CreateCategoryDto, CreateSubCategoryDto, UpdateCategoryDto, UpdateSubCategoryDto } from "./category.dto";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

const createCategory = async (payload: CreateCategoryDto) => {
  const slug = slugify(payload.name);

  // Check if category already exists
  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category with this name already exists");
  }

  const result = await prisma.category.create({
    data: {
      ...payload,
      slug,
    },
  });

  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      subcategories: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: {
        select: { jobs: true }
      }
    },
    orderBy: { sortOrder: "asc" },
  });
  return result;
};

const getCategoryById = async (id: string) => {
  const result = await prisma.category.findUnique({
    where: { id },
    include: {
      subcategories: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return result;
};

const updateCategory = async (id: string, payload: UpdateCategoryDto) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const updateData: any = { ...payload };
  if (payload.name) {
    updateData.slug = slugify(payload.name);
    
    // Check if new slug conflicts with another category
    const conflict = await prisma.category.findFirst({
        where: {
            slug: updateData.slug,
            id: { not: id }
        }
    });
    if (conflict) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category with this name already exists");
    }
  }

  const result = await prisma.category.update({
    where: { id },
    data: updateData,
  });

  return result;
};

const deleteCategory = async (id: string) => {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
  
    if (!existingCategory) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }
  
    const result = await prisma.category.delete({
      where: { id },
    });
  
    return result;
};

// SubCategory Services
const createSubCategory = async (payload: CreateSubCategoryDto) => {
  const slug = slugify(payload.name);

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Parent category not found");
  }

  // Check if subcategory already exists in this category
  const existingSubCategory = await prisma.subCategory.findFirst({
    where: { 
        OR: [
            { slug },
            { categoryId: payload.categoryId, name: payload.name }
        ]
    },
  });

  if (existingSubCategory) {
    throw new AppError(httpStatus.BAD_REQUEST, "SubCategory already exists");
  }

  const result = await prisma.subCategory.create({
    data: {
      ...payload,
      slug,
    },
  });

  return result;
};

const updateSubCategory = async (id: string, payload: UpdateSubCategoryDto) => {
    const existingSubCategory = await prisma.subCategory.findUnique({
      where: { id },
    });
  
    if (!existingSubCategory) {
      throw new AppError(httpStatus.NOT_FOUND, "SubCategory not found");
    }
  
    const updateData: any = { ...payload };
    if (payload.name) {
      updateData.slug = slugify(payload.name);

      const conflict = await prisma.subCategory.findFirst({
          where: {
              slug: updateData.slug,
              id: { not: id }
          }
      });
      if (conflict) {
          throw new AppError(httpStatus.BAD_REQUEST, "SubCategory with this name already exists");
      }
    }
  
    const result = await prisma.subCategory.update({
      where: { id },
      data: updateData,
    });
  
    return result;
};

const deleteSubCategory = async (id: string) => {
    const existingSubCategory = await prisma.subCategory.findUnique({
      where: { id },
    });
  
    if (!existingSubCategory) {
      throw new AppError(httpStatus.NOT_FOUND, "SubCategory not found");
    }
  
    const result = await prisma.subCategory.delete({
      where: { id },
    });
  
    return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
};
