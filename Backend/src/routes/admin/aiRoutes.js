import express from "express";
import { analyzeDataset, chatWithAI, generateOutreachHooks } from "../../controllers/admin/aiController.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

// AI Analysis route
router.post("/analyze-dataset", auth, analyzeDataset);
router.post("/chat-with-ai", auth, chatWithAI);
router.post("/generate-hooks", auth, generateOutreachHooks);

export default router;
