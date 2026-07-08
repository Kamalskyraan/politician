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
    #swagger.tags = ['16.Dashboard Api`s']
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
  "/updateissuecategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Update category for issues and grievance'
    #swagger.description = 'Update category'

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
      description: 'Issue category updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.updateissuecategory,
);
router.post(
  "/getissuecategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Get category for issues and grievance'
    #swagger.description = 'get category'

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
      description: 'Issue category fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.getIssueCat,
);
router.post(
  "/deleteissuecategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Delete and retrieve Issue Categories'
    #swagger.description = 'Delete and retrieve Issue Categories, id and pass active to retrieve or pass inactive to delete'

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
      description: 'issue categories deleted or retrieved successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.deleteIssueCat,
);
router.post(
  "/deleteissuecategorypermanently",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Delete and retrieve Issue Categories permanently'
    #swagger.description = 'Delete and retrieve Issue Categories permanently by passing id'

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
      description: 'issue categories successfully deleted permanently'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ supportController.deleteIssueCatpermanently,
);

router.post(
  "/addsumitcategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
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
  supportController.addSumitCategory,
);
router.post(
  "/getsumitcategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Get category for political sumit'
    #swagger.description = 'get category'

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
      description: 'political sumit category fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.getSumitCategory,
);
router.post(
  "/updatesumitcategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Update category for political sumit'
    #swagger.description = 'update category'

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
              category: {
                type: "string",
                example: "new category"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'political sumit category updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.updatesumitcategory,
);
router.post(
  "/deletesumitcategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Delete category for political sumit'
    #swagger.description = 'Delete category'

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
      description: 'political sumit category updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.deletesumitcategory,
);
router.post(
  "/deletesumitcategorypermanently",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Delete category permanently for political sumit'
    #swagger.description = 'Delete category permanently'

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
      description: 'political sumit category permanently deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.deleteSumitCatpermanently,
);

router.post(
  "/addtravelexpcategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Add category for travel expense'
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
      description: 'Travel expense category added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.addTravelExpCategory,
);
router.post(
  "/updatetravelexpcategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Update category for travel expense'
    #swagger.description = 'Update category'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "numer",
                example: 1
              },
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
      description: 'Travel expense category updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.updateTravelExpcategory,
);
router.post(
  "/deletetravelexpcategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Delete category for travel expense'
    #swagger.description = 'Delete category'

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
      description: 'Travel expense category updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.deleteTravelExpcategory,
);
router.post(
  "/deletetravelexpcategorypermanently",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Delete category permanently for travel expense'
    #swagger.description = 'Delete category permanently'

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
      description: 'Travel expense category permanently deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.deleteTravelExpCatpermanently,
);
router.post(
  "/gettravelexpensecategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Get category for travel expense'
    #swagger.description = 'get category'

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
      description: 'travel expense category fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.getTravelExpenseCategory,
);

router.post(
  "/addmembercategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Add category for member'
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
      description: 'Member category added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.addMemberCategory,
);
router.post(
  "/updatemembercategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Update category for Member'
    #swagger.description = 'Update category'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "numer",
                example: 1
              },
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
      description: 'Member category updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.updateMembercategory,
);
router.post(
  "/deletemembercategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Delete category for member'
    #swagger.description = 'Delete category'

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
      description: 'member category updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.deleteMembercategory,
);
router.post(
  "/deletemembercategorypermanently",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Delete category permanently for member'
    #swagger.description = 'Delete category permanently'

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
      description: 'Member category permanently deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.deletememberCatpermanently,
);
router.post(
  "/getmembercategory",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Get category for Member'
    #swagger.description = 'get category'

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
      description: 'Member category fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.getMemberCategory,
);

router.post(
  "/getuserlist",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Get user list'
    #swagger.description = 'get user list'

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
      description: 'User`s list fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  supportController.getUserList,
);

export default router;
