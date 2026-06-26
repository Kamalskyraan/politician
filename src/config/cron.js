import cron from "node-cron";
import { processMeetingNotifications } from "../utils/helper.js";
import { processAppointmentNotifications } from "../utils/helper.js";
import { processTaskNotifications } from "../utils/helper.js";
import { processTravelNotifications } from "../utils/helper.js";
import { processIssueNotifications } from "../utils/helper.js";
import { processSumitNotifications } from "../utils/helper.js";
import { processOverdueMeetingNotifications } from "../utils/helper.js";
import { processOverdueAppointmentNotifications } from "../utils/helper.js";
import { processOverdueTaskNotifications } from "../utils/helper.js";
import { processOverdueIssueNotifications } from "../utils/helper.js";
import { processOverdueSumitNotifications } from "../utils/helper.js";
import { processDailyStatusChange } from "../utils/helper.js";

const processNotifications = async () => {
  await processDailyStatusChange();

  await processMeetingNotifications();
  await processAppointmentNotifications();
  await processTaskNotifications();
  await processTravelNotifications();
  await processIssueNotifications();
  await processSumitNotifications();

  await processOverdueMeetingNotifications();
  await processOverdueAppointmentNotifications();
  await processOverdueTaskNotifications();
  await processOverdueIssueNotifications();
  await processOverdueSumitNotifications();
};

const schedule =
  process.env.NODE_ENV === "production" ? "0 0 * * *" : "0 0 * * *"; // last one for local change if u want

export const startCronJobs = () => {
  cron.schedule(schedule, async () => {
    try {
      console.log("cron started");
      await processNotifications();
      console.log("cron ended");
    } catch (error) {
      console.log("cron error:", error);
    }
  });
};
