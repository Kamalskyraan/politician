import express from "express";
import * as authcontroller from "../controller/auth.controller.js";


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
              type: {type: "Number", example: 0}
            
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
#swagger.tags = ['10.Auth']
#swagger.summary = 'Sign Up'
#swagger.description = 'User sign up. To create new user'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - name, phn_num, Country_code, email, device_token, device_id, device_type",
  content: {
    "application/json": {
      example: {
      name : "skyraan",
        phn_num: "8888833377",
        c_code: "+91",
        email: "kumar@gmail.com",
        device_token: "abcd",
        device_id: "#1234hsykrnaa",
        device_type: "ios"
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Success',
  schema: {
    success: 1,
    message: 'Operation completed successfully',
    data: [],
    error: ''
  }
}

#swagger.responses[500] = {
  description: 'Internal Server Error',
  schema: {
    success: 0,
    message: 'Internal Server Error',
    data: [],
    error: 'Error message'
  }
}
*/ authcontroller.signUp,
);
router.post(
  "/login",
  /*
#swagger.tags = ['AUTH']
#swagger.summary = 'Login'
#swagger.description = 'User Login'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - email, device_token, device_id, device_type",
  content: {
    "application/json": {
      example: {
        email: "kuma@gmail.com",
        device_token: "abc",
        device_id: "#skyandro000",
        device_type: "android"
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Success',
  schema: {
    success: 1,
    message: 'Operation completed successfully',
    data: [],
    error: ''
  }
}

#swagger.responses[500] = {
  description: 'Internal Server Error',
  schema: {
    success: 0,
    message: 'Internal Server Error',
    data: [],
    error: 'Error message'
  }
}
*/ authcontroller.login,
);

export default router;
