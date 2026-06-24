import express from "express";
import * as issuecontroller from "../controller/issue.controller.js";

const router = express.Router();

router.post(
  "/addissue",
  /*
    #swagger.tags = ['8.ISSUES & GRIEVANCE']
    #swagger.summary = 'Add issue and grievance'
    #swagger.description = 'Add issue and grievance by pssing user_id and other fields'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_fdd8762"
              },
              cat_id: {
                type: "number",
                example: 0
              },
              cat_name: {
                type: "string",
                example: "Education"
              },
              descp: {
                type: "string",
                example: "Issue description has been given here"
              },
              address: {
                type: "string",
                example: "No 10, skyraan, coimbatore"
              },
              lat: {
                type: "string",
                example: "8.2432"
              },
              lng: {
                type: "string",
                example: "19.54332"
              },
              media_id: {
                type: "string",
                example: "1,2,3"
              },
              report_date: {
                type: "string",
                example: "2026-06-10 10:20:32"
              },
              incharge_id: {
                type: "string",
                example: "22,33,32"
              },
              member_id: {
                type: "string",
                example: "122,34,232"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Issue and Grievance added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ issuecontroller.addIssue,
);
router.post(
  "/deleteissue",
  /*
    #swagger.tags = ['8.ISSUES & GRIEVANCE']
    #swagger.summary = 'Delete issue and grievance'
    #swagger.description = 'Delete issue and grievance by pssing id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                example: "3"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Issue and Grievance deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  issuecontroller.deleteIssue,
);
router.post(
  "/updateissue",
  /*
    #swagger.tags = ['8.ISSUES & GRIEVANCE']
    #swagger.summary = 'Update issue and grievance'
    #swagger.description = 'Update issue and grievance by pssing id and other fields'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                example: "3"
              },
              cat_id: {
                type: "number",
                example: 0
              },
              cat_name: {
                type: "string",
                example: "Education"
              },
              descp: {
                type: "string",
                example: "Issue description has been given here"
              },
              address: {
                type: "string",
                example: "No 10, skyraan, coimbatore"
              },
              lat: {
                type: "string",
                example: "8.2432"
              },
              lng: {
                type: "string",
                example: "19.54332"
              },
              media_id: {
                type: "string",
                example: "1,2,3"
              },
              report_date: {
                type: "string",
                example: "2026-06-10 10:20:32"
              },
              incharge_id: {
                type: "string",
                example: "22,33,32"
              },
              member_id: {
                type: "string",
                example: "122,34,232"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Issue and Grievance updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  issuecontroller.updateIssue,
);
router.post(
  "/getIssue",
  /*
    #swagger.tags = ['8.ISSUES & GRIEVANCE']
    #swagger.summary = 'Get issue and grievance'
    #swagger.description = 'Get issue and grievance by pssing user id and other fields'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_EYWH2235"
              },
              status: {
                type: "string",
                example: "pending"
              },
              assigned: {
                type: "string",
                example: "0"
              },
              from_date: {
                type: "string",
                example: "2026-06-12"
              },
              to_date: {
                type: "string",
                example: "2026-06-14"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Issue and Grievance fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  issuecontroller.getIssue,
);
export default router;
