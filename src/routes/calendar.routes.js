import express from "express";
import * as calendarcontroller from "../controller/calendar.controller.js";

const router = express.Router();

router.post(
  "/getcalendarinfo",
  /*
    #swagger.tags = ['11.Calendar']
    #swagger.summary = 'Get calendar details'
    #swagger.description = 'Get calendar details'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_efKL6767"
              },
              from_date: {
                type: "string",
                example: "2026-06-10"
              },
              to_date: {
                type: "string",
                example: "2026-06-12"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Calendar details fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ calendarcontroller.getCalendarInfo,
);
router.post(
  "/gettodayevents",
  /*
    #swagger.tags = ['11.Calendar']
    #swagger.summary = 'Get today calendar events'
    #swagger.description = 'Get today calendar details'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_efKL6767"
              },
              event_date: {
                type: "string",
                example: "2026-06-10"
              },
              page: {
                type: "number",
                example: 1
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Calendar details fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ calendarcontroller.getTodayEvents,
);
router.post(
  "/gettodayeventcounts",
  /*
    #swagger.tags = ['11.Calendar']
    #swagger.summary = 'Get today events counts'
    #swagger.description = 'Get today events counts'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_efKL6767"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Today events counts fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ calendarcontroller.getTodayEventsCounts,
);

export default router;
