import express from "express";
import rateLimit from "express-rate-limit";
import {
  createOrder,
  createCustomDatasetRequest,
  getAnalyticsSummary,
  getCustomDatasetRequests,
  getCustomers,
  getMyOrders,
  getOrders,
  downloadMyOrder,
  getTransactions,
} from "../controllers/businessController.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

const customRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

router.post("/orders", auth, createOrder);
router.get("/me/orders", auth, getMyOrders);
router.get("/me/orders/:orderId/download", auth, downloadMyOrder);
router.post("/custom-requests", customRequestLimiter, createCustomDatasetRequest);
router.get("/admin/orders", auth, requireRole("admin"), getOrders);
router.get("/admin/customers", auth, requireRole("admin"), getCustomers);
router.get("/admin/transactions", auth, requireRole("admin"), getTransactions);
router.get("/admin/analytics", auth, requireRole("admin"), getAnalyticsSummary);
router.get("/admin/custom-requests", auth, requireRole("admin"), getCustomDatasetRequests);

export default router;
