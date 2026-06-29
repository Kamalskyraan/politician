import express from "express";
import { getAnalyticsData } from "../controller/analytic.controller.js";
const router = express.Router();

router.post(
  "/get-analytics-data",
  /*
    #swagger.tags = ['14.Analytics']
    #swagger.summary = 'Get ANalytics Data'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
          
              user_id: {type: "string" , example: "USER_Yl_e5736"},
              type: { type: "string", example: "appointment" },
              c_status :{type :"string" , example : "pending"}
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Analytics data fetched  successfully'
    }

   

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  getAnalyticsData,
);
export default router;
