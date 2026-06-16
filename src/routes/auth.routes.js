import express from "express";
import * as authcontroller from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { deleteAccountCheck } from "../middleware/delAccountCheck.middleware.js";

const router = express.Router();
// router.get("/check",justCheck)

router.post(
  "/requestotp",
  /*
    #swagger.tags = ['1.Auth']
    #swagger.summary = 'Send Otp to related'
    #swagger.description = 'Send OTP via email or phn_num'
 
    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
               email: {type: "string" , example: "abc@gmail.com"},
              c_code: { type: "string", example: "+91" },
              phn_num: {
                type: "string",
                example: "9876543210"
              },
              type: {type: "number", example: 0}
            
            }
          }
        }
      }
    }
 
    #swagger.responses[200] = {
      description: 'OTP send  successfully'
    }
 
    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */
  deleteAccountCheck,
  authcontroller.requestOtp,
);

router.post(
  "/verifyotp",
  /*
    #swagger.tags = ['1.Auth']
    #swagger.summary = 'Verify Otp to related'
    #swagger.description = 'Verify OTP via email or phn_num'
 
    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
               email: {type: "string" , example: "abc@gmail.com"},
              c_code: { type: "string", example: "+91" },
              phn_num: {
                type: "string",
                example: "9876543210"
              },
              otp: {type: "string" , example: "1234"}
            
            }
          }
        }
      }
    }
 
    #swagger.responses[200] = {
      description: 'OTP verified  successfully'
    }
 
    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
  */ authcontroller.verifyOtp,
);

router.post(
  "/signup",
  /*
    #swagger.tags = ['1.Auth']
    #swagger.summary = 'Sign Up'
    #swagger.description = 'User sign up. To create new user'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "skyraan"
              },
              phn_num: {
                type: "string",
                example: "8888833377"
              },
              c_code: {
                type: "string",
                example: "+91"
              },
              email: {
                type: "string",
                example: "kumar@gmail.com"
              },
              device_token: {
                type: "string",
                example: "abcd"
              },
              device_id: {
                type: "string",
                example: "#1234hsykrnaa"
              },
              device_type: {
                type: "string",
                example: "ios"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'User signed up successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ authcontroller.signUp,
);
router.post(
  "/login",
  /*
    #swagger.tags = ['1.Auth']
    #swagger.summary = 'Login'
    #swagger.description = 'User Login'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                example: "skyraan@gmail.com"
              },
              device_token: {
                type: "string",
                example: "abc"
              },
              device_id: {
                type: "string",
                example: "#skyandro000"
              },
              device_type: {
                type: "string",
                example: "android"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'User logged in successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ authcontroller.login,
);
router.post(
  "/accrestore",
  /*
    #swagger.tags = ['1.Auth']
    #swagger.summary = 'Account Restore'
    #swagger.description = 'Account restore by passing email id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                example: "skyraan@gmail.com"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Account restored successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ authcontroller.accountRestore,
);

export default router;
