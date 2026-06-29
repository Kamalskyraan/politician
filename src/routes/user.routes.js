import express from "express";
import * as usercontroller from "../controller/user.controller.js";

const router = express.Router();

router.post(
  "/getuserprofile",
  /*
    #swagger.tags = ['12.User Details']
    #swagger.summary = 'Get user details'
    #swagger.description = 'Get user details by passing user id'

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
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'User profile details fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ usercontroller.getUserProfile,
);
router.post(
  "/updateuserprofile",
  /*
    #swagger.tags = ['12.User Details']
    #swagger.summary = 'Update user details'
    #swagger.description = 'Update user details by passing user id and other fields'

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
              name: {
                type: "string",
                example: "skyraan"
              },
              phn_num: {
                type: "string",
                example: "9876543210"
              },
              c_code: {
                type: "string",
                example: "+91"
              },
              email: {
                type: "string",
                example: "skyraan@gmail.com"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'User profile details updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ usercontroller.updateProfileDetail,
);
router.post(
  "/contact_us",
  /*
    #swagger.tags = ['12.User Details']
    #swagger.summary = 'Contact us'
    #swagger.description = 'Contact us by passing user_id, name, email, phn_num and comments'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_dd1q292"
              },
              name: {
                type: "string",
                example: "skyraan"
              },
              email: {
                type: "string",
                example: "skyraan@gmail.com"
              },
              phn_num: {
                type: "string",
                example: "9876543210"
              },
              c_code: {
                type: "string",
                example: "+91"
              },
              comments: {
                type: "string",
                example: "This inquiry has been made by user"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Inquiry submitted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ usercontroller.contactUs,
);
router.post(
  "/remove-account",
  /*
    #swagger.tags = ['12.User Details']
    #swagger.summary = 'Delete Account'
    #swagger.description = 'Delete account by passing user id and delete reason'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_dd1q292"
              },
              delete_reason: {
                type: "string",
                example: "Not interested"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Account deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ usercontroller.deleteAccount,
);

export default router;
