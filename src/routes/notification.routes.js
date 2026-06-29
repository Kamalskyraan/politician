import express from "express";
import * as notificationcontroller from "../controller/notification.controller.js";

const router = express.Router();

router.post(
  "/getnotification",
  /*
    #swagger.tags = ['13.Notification']
    #swagger.summary = 'Get Notification'
    #swagger.description = 'Get Notifications by passing user_id.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER__-zw9853"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Notifications fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ notificationcontroller.getNotification,
);
router.post(
  "/notificationviewchange",
  /*
    #swagger.tags = ['13.Notification']
    #swagger.summary = 'Set notification view changes, from unseen to seen'
    #swagger.description = 'Set Notifications view by passing id.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER__-zw9853"
              },
              id: {
                type: "number",
                example: 129
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Notifications view changed from unseen to seen successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ notificationcontroller.notificationIsViewChange,
);
router.post(
  "/notificationreadchange",
  /*
    #swagger.tags = ['13.Notification']
    #swagger.summary = 'Set notification read changes, from unread to read'
    #swagger.description = 'Set Notifications read by passing id.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                example: 129
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Notifications read changed from unread to read successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ notificationcontroller.notificationIsReadChange,
);
router.post(
  "/notificationactivecount",
  /*
    #swagger.tags = ['13.Notification']
    #swagger.summary = 'Get active notification count'
    #swagger.description = 'Get notification active count by passing user id.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER__-zw9853"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Notifications active count fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ notificationcontroller.getNotificationActiveCount,
);

export default router;
