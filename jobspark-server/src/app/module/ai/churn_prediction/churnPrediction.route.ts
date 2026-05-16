import express from "express";
import { ChurnPredictionController } from "./churnPrediction.controller";

const router = express.Router();

router.get("/", ChurnPredictionController.getChurnPredictions);
router.post("/retrain", ChurnPredictionController.retrainModel);

export const ChurnPredictionRouter = router;
