import express from "express";
import authRoutes from "./auth.routes.js";
import sourceRoutes from "./source.routes.js";
import userRoutes from "./user.routes.js";
import supportRoutes from "./support.routes.js";
import meetingRoutes from "./meeting.routes.js";
import travelRoutes from "./travel.routes.js";
import taskRoutes from "./task.route.js";
import issueRoutes from "./issues.routes.js";
import politicalsumitRoutes from "./politicalSumit.routes.js";
import reminderRoutes from "./reminder.routes.js";
import calendarRoutes from "./calendar.routes.js";
import notificationRoutes from "./notification.routes.js";
import webRoutes from "./web.routes.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdminToken } from "../middleware/adminAuth.middleware.js";

export const router = express.Router();
router.use("/auth", authRoutes);
router.use("/source", verifyToken, sourceRoutes);
router.use("/meeting", verifyToken, meetingRoutes);

router.use("/support", verifyToken, supportRoutes);
// router.use("/contact", supportRoutes);
router.use("/travel", verifyToken, travelRoutes);
router.use("/task", verifyToken, taskRoutes);
router.use("/issue", verifyToken, issueRoutes);
router.use("/sumit", verifyToken, politicalsumitRoutes);
router.use("/reminder", verifyToken, reminderRoutes);
router.use("/calendar", verifyToken, calendarRoutes);
router.use("/user", verifyToken, userRoutes);
router.use("/notification", verifyToken, notificationRoutes);
router.use("/web", webRoutes);

// router.use("/auth", authRoutes);
// router.use("/source", sourceRoutes);
// router.use("/meeting", meetingRoutes);

// router.use("/support", supportRoutes);
// // router.use("/contact", supportRoutes);
// router.use("/travel", travelRoutes);
// router.use("/task", taskRoutes);
// router.use("/issue", issueRoutes);
// router.use("/sumit", politicalsumitRoutes);
// router.use("/reminder", reminderRoutes);
// router.use("/calendar", calendarRoutes);
// router.use("/user", userRoutes);
// router.use("/notification", notificationRoutes);
// router.use("/web", webRoutes);

export default router;
