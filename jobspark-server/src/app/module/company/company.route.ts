import express from "express";
import { CompanyController } from "./company.controller";

const router = express.Router();

router.get("/", CompanyController.getAllCompanies);
router.get("/:id", CompanyController.getCompanyById);

export const CompanyRoutes = router;
