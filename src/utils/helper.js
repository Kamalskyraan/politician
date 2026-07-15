import dotenv from "dotenv";
import db from "../config/db.js";
import { customAlphabet } from "nanoid";
import jwt from "jsonwebtoken";
import { NOTIFICATION_TEMPLATES } from "../service/notification.template.js";
import { notificationModel } from "../models/notification.model.js";
import { meetingModel } from "../models/meeting.model.js";
import { taskModel } from "../models/task.model.js";
import { travelModel } from "../models/travel.model.js";
import { issueModel } from "../models/issue.model.js";
import { politicalSumitModel } from "../models/politicalsumit.model.js";
import { supportModel } from "../models/support.model.js";
import { userModel } from "../models/user.model.js";
import { sendPushNotification } from "../service/notification.service.js";
const notificationMdl = new notificationModel();
const meetingMdl = new meetingModel();
const taskMdl = new taskModel();
const travelMdl = new travelModel();
const issueMdl = new issueModel();
const sumitMdl = new politicalSumitModel();
const supportMdl = new supportModel();
const userMdl = new userModel();

dotenv.config();

export const genarateotp = ({ email, phn_num, c_code }) => {
  let otp;
  const devEmails = [
    "skyraankamalesh@gmail.com",
    "santhosh.p@skyraan.com",
    "akashskyraan@gmail.com",
  ];

  if (process.env.NODE_ENV === "development") {
    otp = "1234";
  } else if (
    phn_num === "9487586186" ||
    phn_num === "9876543210" ||
    devEmails.includes(email?.toLowerCase())
  ) {
    otp = "1234";
  } else {
    otp = String(Math.floor(1000 + Math.random() * 9000));
  }
  return otp;
};

export const executeQuery = async (query, params = []) => {
  // console.log(query)
  // console.log(params)
  try {
    const [rows] = await db.execute(query, params);
    // console.log("from execute query",rows);

    return {
      success: 1,
      data: rows,
    };
  } catch (error) {
    return {
      success: 0,
      error: error.message,
    };
  }
};

export const sendResponse = async (
  res,
  statuscode,
  success,
  message,
  data,
  error,
) => {
  return res.status(statuscode).json({
    status: statuscode,
    success: success,
    message: message,
    data: data || [],
    error: error || "",
  });
};

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  4,
);

export const createUserID = async () => {
  const key = Date.now().toString().slice(-4);
  const user_id = `USER_${nanoid(4)}${key}`;
  return user_id;
};

export const getCurrentDateTime = async () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, 0);
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, 0);
  const minutes = String(now.getMinutes()).padStart(2, 0);
  const seconds = String(now.getSeconds()).padStart(2, 0);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const generateJwtToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

export const formatDateForSQL = (dateObj) => {
  // console.log(dateObj);
  if (!dateObj) return null;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// export const formatDateForSQL = (dateObj) => {
//   if (!dateObj) return null; // handle missing/null safely
//   return new Date(dateObj).toISOString().slice(0, 19).replace("T", " ");
// };

// export const convertToMilliseconds = (date) => {
//   return new Date(date).getTime();
// };

// export const replaceNullWithEmptyString = (data) => {
//   return JSON.parse(JSON.stringify(data, (_, value) => value ?? ""));
// };
//
export const replaceNullWithEmptyString = (data) => {
  if (data === null || data === undefined) {
    return "";
  }

  if (Array.isArray(data)) {
    return data.map(replaceNullWithEmptyString);
  }

  if (data instanceof Date) {
    return data; // preserve Date exactly as-is
  }

  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        replaceNullWithEmptyString(value),
      ]),
    );
  }

  return data;
};

export const dateToMillis = (data, dateCols) => {
  // array
  if (Array.isArray(data)) {
    data.forEach((item) => {
      dateToMillis(item, dateCols);
    });

    return data;
  }

  // object
  if (data && typeof data === "object") {
    Object.keys(data).forEach((key) => {
      const value = data[key];

      // convert date fields
      if (dateCols.includes(key) && value !== "") {
        data[key] = new Date(value);
      }
      // nested object / nested array
      else if (typeof value === "object" && value !== null) {
        dateToMillis(value, dateCols);
      }
    });
  }

  return data;
};

export const getDaysDiff = (date) =>
  Math.floor((Date.now() - new Date(date)) / 86400000);

export const addNotification = async (
  templateKey,
  receiver_id,
  reference_type,
  reference_id,
) => {
  // console.log(templateKey, receiver_id, reference_type, reference_id);
  const template = NOTIFICATION_TEMPLATES[templateKey];

  const notificationData = {
    receiver_id: receiver_id,
    title: template.title,
    message: template.message,
    type: template.type,
    reference_type: reference_type,
    reference_id: reference_id,
  };

  return await notificationMdl.addNotification(notificationData);
};

export const deleteNotification = async (
  receiver_id,
  reference_type,
  reference_id,
) => {
  console.log(receiver_id, reference_type, reference_id);

  const data = {
    receiver_id: receiver_id,
    reference_type: reference_type,
    reference_id: reference_id,
  };
  await notificationMdl.deleteNotification(data);
};

export const processMeetingNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const meetings = (await meetingMdl.getTodayMeetings(today)) || [];

    // console.log("from db result:", meetings);

    if (meetings.data.length === 0) {
      return;
    }

    // console.log("meeting count:", meeting_count);
    const userMeetingCount = {};

    if (meetings?.success === 1) {
      for (const meeting of meetings.data) {
        // console.log("inside in app notification");
        await addNotification(
          "MEETING_CREATED",
          meeting.user_id,
          "meeting",
          meeting.id,
        );

        // count meetings per user
        userMeetingCount[meeting.user_id] =
          (userMeetingCount[meeting.user_id] || 0) + 1;
      }
      // console.log("Meeting count per user ID:", userMeetingCount);
      for (const [user_id, count] of Object.entries(userMeetingCount)) {
        // console.log("for push notification", user_id, count);
        await sendPushNotification({
          user_id,
          payload: {
            title: "Today's Schedule",
            message: `Today you have ${count} meeting${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Meeting Notification Error:", error);
  }
};
export const processAppointmentNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const appointments = (await meetingMdl.getTodayAppointments(today)) || [];

    if (appointments.data.length === 0) {
      return;
    }

    const userAppointmentCount = {};

    if (appointments?.success === 1) {
      for (const appointment of appointments.data) {
        await addNotification(
          "APPOINTMENT_CREATED",
          appointment.user_id,
          "appointment",
          appointment.id,
        );
        // count meetings per user
        userAppointmentCount[appointment.user_id] =
          (userAppointmentCount[appointment.user_id] || 0) + 1;
      }

      for (const [user_id, count] of Object.entries(userAppointmentCount)) {
        await sendPushNotification({
          user_id,
          payload: {
            title: "Today's Schedule",
            message: `Today you have ${count} appointment${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Appointment Notification Error:", error);
  }
};
export const processTaskNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const tasks = (await taskMdl.getTodayTasks(today)) || [];

    if (tasks.data.length === 0) {
      return;
    }

    const userTaskCount = {};

    if (tasks?.success === 1) {
      for (const task of tasks.data) {
        await addNotification("TASK_CREATED", task.user_id, "task", task.id);
        userTaskCount[task.user_id] = (userTaskCount[task.user_id] || 0) + 1;
      }

      for (const [user_id, count] of Object.entries(userTaskCount)) {
        await sendPushNotification({
          user_id,
          payload: {
            title: "Today's Schedule",
            message: `Today you have ${count} task${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Task Notification Error:", error);
  }
};
export const processTravelNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const travels = (await travelMdl.getTodayTravels(today)) || [];

    if (travels.data.length === 0) {
      return;
    }

    // console.log("meeting count:", meeting_count);
    const userTravelCount = {};

    if (travels?.success === 1) {
      for (const travel of travels.data) {
        await addNotification(
          "TRAVEL_CREATED",
          travel.user_id,
          "travel",
          travel.id,
        );
        // count meetings per user
        userTravelCount[travel.user_id] =
          (userTravelCount[travel.user_id] || 0) + 1;
      }

      for (const [user_id, count] of Object.entries(userMeetingCount)) {
        await sendPushNotification({
          user_id,
          payload: {
            title: "Today's Schedule",
            message: `Today you have ${count} travel${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Travel Notification Error:", error);
  }
};
export const processIssueNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const issues = (await issueMdl.getTodayIssues(today)) || [];
    // console.log(issues);

    if (issues.data.length === 0) {
      return;
    }

    // console.log("meeting count:", meeting_count);
    const userIssueCount = {};

    if (issues?.success === 1) {
      for (const issue of issues.data) {
        await addNotification(
          "ISSUE_CREATED",
          issue.user_id,
          "issue",
          issue.id,
        );
        // count meetings per user
        userIssueCount[issue.user_id] =
          (userIssueCount[issue.user_id] || 0) + 1;
      }

      for (const [user_id, count] of Object.entries(userIssueCount)) {
        await sendPushNotification({
          user_id,
          payload: {
            title: "Today's Schedule",
            message: `Today you have ${count} issue${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Issue Notification Error:", error);
  }
};
export const processSumitNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const sumits = (await sumitMdl.getTodaySumits(today)) || [];

    if (sumits.data.length === 0) {
      return;
    }

    // console.log("meeting count:", meeting_count);
    const userSumitCount = {};

    if (sumits?.success === 1) {
      for (const sumit of sumits.data) {
        await addNotification(
          "SUMIT_CREATED",
          sumit.user_id,
          "sumit",
          sumit.id,
        );
        // count meetings per user
        userSumitCount[sumit.user_id] =
          (userSumitCount[sumit.user_id] || 0) + 1;
      }

      for (const [user_id, count] of Object.entries(userSumitCount)) {
        await sendPushNotification({
          user_id,
          payload: {
            title: "Today's Schedule",
            message: `Today you have ${count} political sumit${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Sumit Notification Error:", error);
  }
};

export const processOverdueMeetingNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const results = (await meetingMdl.getOverdueMeetings(today)) || [];

    if (results.data.length === 0) {
      return;
    }

    // console.log("meeting count:", meeting_count);
    const userMeetingCount = {};

    if (results?.success === 1) {
      for (const result of results.data) {
        await addNotification(
          "MEETING_OVERDUE",
          result.user_id,
          "meeting",
          result.id,
        );
        // count meetings per user
        userMeetingCount[result.user_id] =
          (userMeetingCount[result.user_id] || 0) + 1;
      }
      for (const [user_id, count] of Object.entries(userMeetingCount)) {
        await sendPushNotification({
          user_id,
          payload: {
            title: "Action Required",
            message: `You have ${count} overdue meeting${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Overdue Meeting Notification Error:", error);
  }
};
export const processOverdueAppointmentNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const results = (await meetingMdl.getOverdueAppointments(today)) || [];

    if (results.data.length === 0) {
      return;
    }

    // console.log("meeting count:", meeting_count);
    const userAppointmentCount = {};

    if (results?.success === 1) {
      for (const result of results.data) {
        await addNotification(
          "APPOINTMENT_OVERDUE",
          result.user_id,
          "appointment",
          result.id,
        );
        // count meetings per user
        userAppointmentCount[result.user_id] =
          (userAppointmentCount[result.user_id] || 0) + 1;
      }
      for (const [user_id, count] of Object.entries(userAppointmentCount)) {
        await sendPushNotification({
          user_id,
          payload: {
            title: "Action Required",
            message: `You have ${count} overdue appointment${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Overdue Appointment Notification Error:", error);
  }
};
export const processOverdueTaskNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const results = (await taskMdl.getOverdueTasks(today)) || [];
    // console.log(results);

    if (results.data.length === 0) {
      return;
    }

    // console.log("meeting count:", meeting_count);
    const userTaskCount = {};

    if (results?.success === 1) {
      for (const result of results.data) {
        await addNotification(
          "TASK_OVERDUE",
          result.user_id,
          "task",
          result.id,
        );
        // count meetings per user
        userTaskCount[result.user_id] =
          (userTaskCount[result.user_id] || 0) + 1;
      }
      for (const [user_id, count] of Object.entries(userTaskCount)) {
        await sendPushNotification({
          user_id,
          payload: {
            title: "Action Required",
            message: `You have ${count} overdue task${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Overdue Task Notification Error:", error);
  }
};
export const processOverdueIssueNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const results = (await issueMdl.getOverdueIssues(today)) || [];

    if (results.data.length === 0) {
      return;
    }

    // console.log("meeting count:", meeting_count);
    const userIssueCount = {};

    if (results?.success === 1) {
      for (const result of results.data) {
        await addNotification(
          "ISSUE_OVERDUE",
          result.user_id,
          "issue",
          result.id,
        );
        // count meetings per user
        userIssueCount[result.user_id] =
          (userIssueCount[result.user_id] || 0) + 1;
      }
      for (const [user_id, count] of Object.entries(userIssueCount)) {
        await sendPushNotification({
          user_id,
          payload: {
            title: "Action Required",
            message: `You have ${count} overdue issue${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Overdue issue Notification Error:", error);
  }
};
export const processOverdueSumitNotifications = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);

    const results = (await sumitMdl.getOverdueSumits(today)) || [];

    if (results.data.length === 0) {
      return;
    }

    // console.log("meeting count:", meeting_count);
    const userSumitCount = {};

    if (results?.success === 1) {
      for (const result of results.data) {
        await addNotification(
          "SUMIT_OVERDUE",
          result.user_id,
          "sumit",
          result.id,
        );
        // count meetings per user
        userSumitCount[result.user_id] =
          (userSumitCount[result.user_id] || 0) + 1;
      }
      for (const [user_id, count] of Object.entries(userSumitCount)) {
        await sendPushNotification({
          user_id,
          payload: {
            title: "Action Required",
            message: `You have ${count} overdue political sumit${count > 1 ? "s" : ""}.`,
          },
        });
      }
    }
  } catch (error) {
    console.log("Overdue sumit Notification Error:", error);
  }
};

export const processDailyStatusChange = async () => {
  try {
    const today = formatDateForSQL(new Date()).slice(0, 10);
    const result = await supportMdl.processDailyStatusChange(today);
  } catch (error) {
    console.log("status change error:", error);
  }
};

// to delete deleted user after 30 days
export const deleteUserPermanentely = async () => {
  try {
    const result = await userMdl.deleteUserPermanentely();
  } catch (error) {
    return sendResponse(
      res,
      500,
      0,
      "Internal server error",
      [],
      error.message,
    );
  }
};

//

export const getCategoryIcon = async (catImgIds) => {
  if (!catImgIds) return [];
  const ids = String(catImgIds)
    .split(",")
    .map((id) => Number(id.trim()))
    .filter(Boolean);

  const media = await srcMdl.getMedia(ids);
  return media?.success ? media.data : [];
};
