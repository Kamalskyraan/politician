import express from "express";
import * as politicalsumitcontroller from "../controller/politicalsumit.controller.js";

const router = express.Router();

router.post(
  "/addsumit",
  /*
    #swagger.tags = ['9.POLITICAL SUMIT']
    #swagger.summary = 'Add political sumit'
    #swagger.description = 'Add political sumit by passing user id and other fields'

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
              title: {
                type: "string",
                example: "Election campaign"
              },
              location: {
                type: "string",
                example: "no 10, skyraan, coimbatore"
              },
              lat: {
                type: "string",
                example: "56.4313"
              },
              lng: {
                type: "string",
                example: "56.4313"
              },
              sumit_date: {
                type: "string",
                example: "2026-06-12 10:10:21"
              },
              vip: {
                type: "array",
                example: [
                    {
                    name: "Minister A",
                    cat_id: 1,
                    cat_name: ""
                    },
                    {
                    name: "Minister B",
                    cat_id: 0,
                    cat_name: "Transport"
                    }
                    ]
                },
                member: {
                type: "array",
                example: []
                },
                sumit_incharge: {
                type: "array",
                example: [
                    {
                    name: "Minister A",
                    cat_id: 1,
                    cat_name: ""
                    },
                    {
                    name: "Minister B",
                    cat_id: 0,
                    cat_name: "Transport"
                    }
                    ]
                },
                dept_incharge: {
                type: "array",
                example: [
                    {
                    name: "Minister A",
                    cat_id: 1,
                    cat_name: "",
                    dept_id: 1,
                    dept_name: ""
                    },
                    {
                    name: "Minister B",
                    cat_id: 0,
                    cat_name: "Transport",
                    dept_id: 0,
                    dept_name: "Transport"
                    }
                    ]
                }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Political sumit added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  politicalsumitcontroller.addSumit,
);
router.post(
  "/deletesumit" /*
    #swagger.tags = ['9.POLITICAL SUMIT']
    #swagger.summary = 'Delete political sumit'
    #swagger.description = 'Delete political sumit by pssing id'

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
      description: 'political sumit deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/,
  politicalsumitcontroller.deletesumit,
);
router.post(
  "/getsumit",
  /*
    #swagger.tags = ['9.POLITICAL SUMIT']
    #swagger.summary = 'Get political sumit'
    #swagger.description = 'Get political sumit by pssing user id and other related fields'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "3"
              },
              status: {
                type: "string",
                example: "pending"
              },
              from_date: {
                type: "string",
                example: "2026-06-10 17:27:43"
              },
              to_date: {
                type: "string",
                example: "2026-06-10 17:27:43"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'political sumit fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  politicalsumitcontroller.getSumit,
);

export default router;
