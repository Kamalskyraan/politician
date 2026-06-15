import express from "express";
import authRoutes from "./auth.routes.js";
import sourceRoutes from "./source.routes.js";
import userRoutes from "./user.routes.js";
import supportRoutes from "./support.routes.js";
import meetingRoutes from "./meeting.routes.js";
import travelRoutes from "./travel.routes.js";
import taskRoutes from "./task.route.js";
import finaceRoutes from "./finance.routes.js";

import politicalsumitRoutes from "./politicalSumit.routes.js";
import folderRoutes from "./folder.routes.js";
import issueRoutes from "./issues.routes.js";
import politicalsumitRoutes from "./politicalSumit.routes.js";
import reminderRoutes from "./reminder.routes.js";
import { verifyToken } from "../middleware/auth.middleware.js";

export const router = express.Router();
router.use("/auth", authRoutes);
router.use("/source", sourceRoutes);
router.use("/meeting", meetingRoutes);

router.use("/user", userRoutes);
router.use("/support", supportRoutes);
// router.use("/contact", supportRoutes);
router.use("/travel", travelRoutes);
router.use("/task", taskRoutes);
router.use("/finance", finaceRoutes);
router.use("/folder", folderRoutes);
router.use("/issue", issueRoutes);
router.use("/sumit", politicalsumitRoutes);
router.use("/reminder", reminderRoutes);

export default router;
