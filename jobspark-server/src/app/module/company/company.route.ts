import express from "express";
import { CompanyController } from "./company.controller";

const router = express.Router();

router.get("/", CompanyController.getAllCompanies);
router.get("/:id", CompanyController.getCompanyById);

// Pipeline Stages Routes
router.get("/:id/pipeline-stages", CompanyController.getPipelineStages);
router.post("/:id/pipeline-stages", CompanyController.createPipelineStage);
router.put("/:id/pipeline-stages/reorder", CompanyController.reorderPipelineStages);
router.patch("/:id/pipeline-stages/:stageId", CompanyController.updatePipelineStage);
router.delete("/:id/pipeline-stages/:stageId", CompanyController.deletePipelineStage);

export const CompanyRoutes = router;
