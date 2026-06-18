import express from "express";
import * as supportController from "../controller/support.controller.js";

const router = express.Router();

router.post("/addfaq", supportController.addFaq);
router.post(
  "/getfaq",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Get frequent questions and answers'
    #swagger.description = 'Get frequent questions and answers'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                example: "active"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Filter list fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.getFaq,
);
router.post(
  "/updatefaq",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Udpate frequent questions and answers'
    #swagger.description = 'Update frequent questions and answers'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                example: 1
              },
              question: {
                type: "string",
                example: "faq question"
              },
              answer: {
                type: "string",
                example: "faq answer"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Faq updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.updateFaq,
);
router.post(
  "/deletefaq",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Delete and retrieve frequent questions and answers'
    #swagger.description = 'Delete and retrieve frequent questions and answers, id and pass active to retrieve or pass inactive to delete'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                example: 1
              },
              status: {
                type: "string",
                example: "active"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Faq deleted or retrieved successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.deleteFaq,
);
router.post(
  "/deletefaqpermanently",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Delete faq permanently'
    #swagger.description = 'Delete faq permanently'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                example: 1
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Faq successfully deleted permanently'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.deleteFaqPermanently,
);

router.post(
  "/filterapi",
  /*
    #swagger.tags = ['3.Member']
    #swagger.summary = 'Get filter list for member filter'
    #swagger.description = 'Get filter list for member filter as per the user added'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_1JDE1213"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Filter list fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.filterApi,
);
router.post(
  "/getcountry",
  /*
    #swagger.tags = ['3.Member']
    #swagger.summary = 'Get Country,State,district DROPDOWN list'
    #swagger.description = 'Get country,state,district Dropdowns by passing country and state'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              country: {
                type: "string",
                example: "India"
              },
              state: {
                type: "string",
                example: "Tamil Nadu"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Filter list fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.getCountries,
);
router.post(
  "/statuschange",
  /*
    #swagger.tags = ['15.Support Api`s']
    #swagger.summary = 'Change status of Meeting,Appointment,Task,issues and political sumit'
    #swagger.description = 'Change status'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "number",
                example: 12
              },
              status: {
                type: "string",
                example: "completed"
              },
              type: {
                type: "string",
                example: "meeting"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'status changed successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.updateStatus,
);
router.post(
  "/issuecategory",
  /*
    #swagger.tags = ['15.Support Api`s']
    #swagger.summary = 'Add category for issues and grievance'
    #swagger.description = 'Add category'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                example: "Road"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Issue category added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.addIssueCat,
);
router.post(
  "/addsumitcategory",
  /*
    #swagger.tags = ['15.Support Api`s']
    #swagger.summary = 'Add category for political sumit'
    #swagger.description = 'Add category'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                example: "Road"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'political sumit category added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.addSumitcategory,
);
export default router;
