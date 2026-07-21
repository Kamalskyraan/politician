import express from "express";
import * as webController from "../controller/web.controller.js";
import { verifyAdminToken } from "../middleware/adminAuth.middleware.js";

const router = express.Router();

//public routes for dashboard

router.post(
  "/adminlogin",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Dashboard admin login'
    #swagger.description = 'Dashboard admin login'

     #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_name: {
                type: "string",
                example: "admin@skyraan"
              },
              password: {
                type: "string",
                example: "admin"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'login successfull'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  webController.adminLogin,
);

router.use(verifyAdminToken);

//private routes for dashboard with token middleware

router.post(
  "/addfaq",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Add frequent questions and answers'
    #swagger.description = 'Add frequent questions and answers'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
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
      description: 'faq added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ webController.addFaq,
);
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
      description: 'Faq list fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ webController.getFaq,
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
*/ webController.updateFaq,
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
*/ webController.deleteFaq,
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
*/ webController.deleteFaqPermanently,
);

// router.post(
//   "/filterapi",
//   /*
//     #swagger.tags = ['3.Member']
//     #swagger.summary = 'Get filter list for member filter'
//     #swagger.description = 'Get filter list for member filter as per the user added'

//     #swagger.requestBody = {
//       required: true,
//       content: {
//         "application/json": {
//           schema: {
//             type: "object",
//             properties: {
//               user_id: {
//                 type: "string",
//                 example: "USER_1JDE1213"
//               }
//             }
//           }
//         }
//       }
//     }

//     #swagger.responses[200] = {
//       description: 'Filter list fetched successfully'
//     }

//     #swagger.responses[500] = {
//       description: 'Internal Server Error'
//     }
// */ webController.filterApi,
// );
// router.post(
//   "/getcountry",
//   /*
//     #swagger.tags = ['3.Member']
//     #swagger.summary = 'Get Country,State,district DROPDOWN list'
//     #swagger.description = 'Get country,state,district Dropdowns by passing country and state'

//     #swagger.requestBody = {
//       required: true,
//       content: {
//         "application/json": {
//           schema: {
//             type: "object",
//             properties: {
//               country: {
//                 type: "string",
//                 example: "India"
//               },
//               state: {
//                 type: "string",
//                 example: "Tamil Nadu"
//               },
//             }
//           }
//         }
//       }
//     }

//     #swagger.responses[200] = {
//       description: 'Filter list fetched successfully'
//     }

//     #swagger.responses[500] = {
//       description: 'Internal Server Error'
//     }
// */ webController.getCountries,
// );
// router.post(
//   "/statuschange",
//   /*
//     #swagger.tags = ['15.Support Api`s']
//     #swagger.summary = 'Change status of Meeting,Appointment,Task,issues and political sumit'
//     #swagger.description = 'Change status'

//     #swagger.requestBody = {
//       required: true,
//       content: {
//         "application/json": {
//           schema: {
//             type: "object",
//             properties: {
//               id: {
//                 type: "number",
//                 example: 12
//               },
//               status: {
//                 type: "string",
//                 example: "completed"
//               },
//               type: {
//                 type: "string",
//                 example: "meeting"
//               },
//             }
//           }
//         }
//       }
//     }

//     #swagger.responses[200] = {
//       description: 'status changed successfully'
//     }

//     #swagger.responses[500] = {
//       description: 'Internal Server Error'
//     }
// */
//   webController.updateStatus,
// );

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
*/ webController.addIssueCat,
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
*/ webController.updateissuecategory,
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
*/ webController.getIssueCat,
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
*/ webController.deleteIssueCat,
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
*/ webController.deleteIssueCatpermanently,
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
  webController.addSumitCategory,
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
  webController.getSumitCategory,
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
  webController.updatesumitcategory,
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
  webController.deletesumitcategory,
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
  webController.deleteSumitCatpermanently,
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
  webController.addTravelExpCategory,
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
  webController.updateTravelExpcategory,
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
  webController.deleteTravelExpcategory,
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
  webController.deleteTravelExpCatpermanently,
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
  webController.getTravelExpenseCategory,
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
  webController.addMemberCategory,
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
  webController.updateMembercategory,
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
  webController.deleteMembercategory,
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
  webController.deletememberCatpermanently,
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
  webController.getMemberCategory,
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
  webController.getUserList,
);
router.post(
  "/getuserenquiry",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Get user enquiries'
    #swagger.description = 'get user enquiries'

     #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                example: "pending"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'User`s enquiry fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  webController.getUserEnquiries,
);
router.post(
  "/updateuserenquiry",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Update user enquiries'
    #swagger.description = 'Update user enquiries'

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
                example: "resolved"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'User`s enquiry updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  webController.updateUserEnquiries,
);

export default router;
