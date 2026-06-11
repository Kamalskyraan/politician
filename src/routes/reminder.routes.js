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

export default router;
