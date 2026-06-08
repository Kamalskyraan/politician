import express from "express";
import authRoutes from "./auth.routes.js";
import sourceRoutes from "./source.routes.js";
import userRoutes from "./user.routes.js";
import supportRoutes from "./support.routes.js";
import meetingRoutes from "./meeting.routes.js";
import travelRoutes from "./travel.routes.js";
import finaceRoutes from "./finance.routes.js";
import { verifyToken } from "../middleware/auth.middleware.js";

export const router = express.Router();
router.use("/auth", authRoutes);
router.use("/source", sourceRoutes);
router.use("/meeting", meetingRoutes);

router.use("/user", userRoutes);
router.use("/faq", supportRoutes);
// router.use("/contact", supportRoutes);
router.use("/travel", travelRoutes);
router.use("/finance", finaceRoutes);
router.use("/meeting", verifyToken, meetingRoutes);

router.use("/user", userRoutes);
router.use("/support", supportRoutes);
// router.use("/contact", supportRoutes);
router.use("/travel", travelRoutes);
router.use("/task", taskRoutes);

export default router;
