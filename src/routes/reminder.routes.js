import express from "express";
import * as remindercontroller from "../controller/reminder.controller.js";

const router = express.Router();

router.post(
  "/getreminder",
  /*
    #swagger.tags = ['10.REMINDERS']
    #swagger.summary = 'Get reminders'
    #swagger.description = 'Get reminders by passing user id and status'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "User_dhh21332"
              },
              status: {
                type: "string",
                example: "snoozed"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Reminders fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ remindercontroller.getReminder,
);
router.post(
  "/updatereminder",
  /*
    #swagger.tags = ['10.REMINDERS']
    #swagger.summary = 'Update reminders'
    #swagger.description = 'Update reminders by passing id and other fields'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
            user_id: {
                type: "string",
                example: "User_dhh21332"
              },
              remind_time: {
                type: "string",
                example: "2026-07-01 15:20:00"
              },
              current_time: {
                type: "string",
                example: "2026-07-01 15:21:00"
              },
              is_remind: {
                type: "number",
                example: 2
              },
              snooze_at: {
                type: "string",
                example: "300"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Reminders updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  remindercontroller.updateReminder,
);
router.post(
  "/upcomingreminder",
  /*
    #swagger.tags = ['10.REMINDERS']
    #swagger.summary = 'Upcoming reminders'
    #swagger.description = 'Upcoming reminders by passing id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_ZNLl2665"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Upcoming Reminders fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  remindercontroller.upcomingReminder,
);

export default router;
