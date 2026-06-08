import express from "express";
import * as taskcontroller from "../controller/task.controller.js";
const router = express.Router();

router.post(
  "/addtask",
  /*
    #swagger.tags = ['7.TASK & REMINDERS']
    #swagger.summary = 'Add Task and reminders'
    #swagger.description = 'Add task and reminders by passing user id and other fields'

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
              title: {
                type: "string",
                example: "election meeting"
              },
              descp: {
                type: "string",
                example: "Met cm Regarding New Posting"
              },
              t_priority: {
                type: "number",
                example: 1
              },
              from_date: {
                type: "string",
                example: "2026-06-07 18:10:30"
              },
              to_date: {
                type: "string",
                example: "2026-06-07 18:10:30"
              },
              media_id: {
                type: "string",
                example: "1,2,3"
              },
              attnds_id: {
                type: "string",
                example: "10,21,24"
              },
              is_remind: {
                type: "number",
                example: 1
              },
              remind_tenure: {
                type: "string",
                example: "600"
              },
              snooze_at: {
                type: "string",
                example: "100"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Task and reminder added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  taskcontroller.addTask,
);
router.post(
  "/deletetask",
  /*
    #swagger.tags = ['7.TASK & REMINDERS']
    #swagger.summary = 'Delete Task and reminders'
    #swagger.description = 'delete task and reminders by passing user id and task id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                example: 2
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Task and reminder deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  taskcontroller.deleteTask,
);
router.post(
  "/updatetask",
  /*
    #swagger.tags = ['7.TASK & REMINDERS']
    #swagger.summary = 'Update Task and reminders'
    #swagger.description = 'Update task and reminders by passing user id and other fields to update'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                example: 2
              },
              title: {
                type: "string",
                example: "election meeting"
              },
              descp: {
                type: "string",
                example: "Met cm Regarding New Posting"
              },
              t_priority: {
                type: "number",
                example: 1
              },
              from_date: {
                type: "string",
                example: "2026-06-07 18:10:30"
              },
              to_date: {
                type: "string",
                example: "2026-06-07 18:10:30"
              },
              media_id: {
                type: "string",
                example: "1,2,3"
              },
              attnds_id: {
                type: "string",
                example: "10,21,24"
              },
              is_remind: {
                type: "number",
                example: 1
              },
              remind_tenure: {
                type: "string",
                example: "600"
              },
              snooze_at: {
                type: "string",
                example: "100"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Task and reminder updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ taskcontroller.updateTask,
);

export default router;
