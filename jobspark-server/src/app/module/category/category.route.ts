import express from "express";
import { CategoryController } from "./category.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import validateRequest from "@/app/middleware/validateRequest";
import { 
    createCategorySchema, 
    createSubCategorySchema, 
    updateCategorySchema, 
    updateSubCategorySchema 
} from "./category.dto";

const router = express.Router();

// Public routes
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

// Admin only routes - Categories
router.post(
    "/create", 
    checkAuth(UserRole.ADMIN), 
    validateRequest(createCategorySchema), 
    CategoryController.createCategory
);

router.patch(
    "/:id", 
    checkAuth(UserRole.ADMIN), 
    validateRequest(updateCategorySchema), 
    CategoryController.updateCategory
);

router.delete(
    "/:id", 
    checkAuth(UserRole.ADMIN), 
    CategoryController.deleteCategory
);

// Admin only routes - SubCategories
router.post(
    "/sub/create", 
    checkAuth(UserRole.ADMIN), 
    validateRequest(createSubCategorySchema), 
    CategoryController.createSubCategory
);

router.patch(
    "/sub/:id", 
    checkAuth(UserRole.ADMIN), 
    validateRequest(updateSubCategorySchema), 
    CategoryController.updateSubCategory
);

router.delete(
    "/sub/:id", 
    checkAuth(UserRole.ADMIN), 
    CategoryController.deleteSubCategory
);

export const CategoryRoutes = router;
