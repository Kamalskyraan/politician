import { Router } from "express";
import {
  addUpdateFinanceData,
  downloadFinanceReport,
  getFinanceData,
  getReportData,
  removeFinanceData,
} from "../controller/finance.controller.js";

const router = Router();

router.post(
  "/add-finance-data",
  /*
    #swagger.tags = ['10.Finance']
    #swagger.summary = 'Add or Update Finance'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              user_id: {type: "string" , example: "USER_Yl_e5736"},
              type: { type: "string", example: "income" },
              cat_id: { type: "string", example: "1" },
              cat_name: { type: "string", example: "Medical Expense" },
              trans_date: { type: "string", example: "2026-06-03" },
              amount: { type: "number", example: 1500 },
              notes: { type: "string", example: "Hospital bill" },
              attachment: { type: "string", example: "1,2,3" }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Finance saved successfully'
    }

   

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  addUpdateFinanceData,
);

router.post(
  "/get-finance-data",
  /*
    #swagger.tags = ['10.Finance']
    #swagger.summary = 'Get Finance Data'
    #swagger.description = 'Fetch finance data based on filters'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 1
              },
              user_id: {
                type: "string",
                example: "USER_Yl_e5736"
              },
              type: {
                type: "string",
                example: "income"
              },
              category: {
                type: "string",
                example: "medical"
              },
              amount: {
                type: "number",
                example: 1500
              },
              from_date: {
                type: "string",
                example: "2026-03-22"
              },
              to_date: {
                type: "string",
                example: "2026-03-25"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Finance data fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  getFinanceData,
);
router.post(
  "/remove-finance-data",
  /*
    #swagger.tags = ['10.Finance']
    #swagger.summary = 'Remove Finance Data'
    #swagger.description = 'Delete Finance Data BY ID'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 1
              },
             
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Finance data removed successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  removeFinanceData,
);
router.post(
  "/get-report-data",
  /*
    #swagger.tags = ['10.Finance']
    #swagger.summary = 'get Report Data'
    #swagger.description = 'Get Report Data'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
               user_id: {type: "string" , example: "USER_Yl_e5736"},
              type: { type: "string", example: "income" },
              from_date: {
                type: "string",
                example: "2026-03-22"
              },
              to_date: {
                type: "string",
                example: "2026-03-25"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Report data fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  getReportData,
);

router.post(
  "/get-report-download",
  /*
    #swagger.tags = ['10.Finance']
    #swagger.summary = 'get Report Download'
    #swagger.description = 'Get Report Download'

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
               user_id: {type: "string" , example: "USER_Yl_e5736"},
              type: { type: "string", example: "income" },
              from_date: {
                type: "string",
                example: "2026-03-22"
              },
              to_date: {
                type: "string",
                example: "2026-03-25"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Report data downloaded successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  downloadFinanceReport,
);

export default router;
