import express from "express";
import * as authcontroller from "../controller/auth.controller.js";

const router = express.Router();
// router.get("/check",justCheck)
router.post(
  "/requestotp",
  /*
#swagger.tags = ['AUTH']
#swagger.summary = 'Request OTP'
#swagger.description = 'Send OTP to user`s email or phone number. type = 0 for new users (email and phone number verification before sign up) and type = 1 for already signed up users(login, change number or email)'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - type, Either email or country code + phone number",
  content: {
    "application/json": {
      example: {
        email: "skyraan@gmail.com",
        type: 0,
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
*/
  authcontroller.requestOtp,
);
router.post(
  "/verifyotp",
  /*
#swagger.tags = ['AUTH']
#swagger.summary = 'Verify OTP'
#swagger.description = 'Verify OTP which sent to user`s email or phone number.'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - to which (email or phn_num) OTP sent to and the otp",
  content: {
    "application/json": {
      example: {
        email: "skyraan@gmail.com",
        otp: 1234,
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
*/ authcontroller.verifyOtp,
);
router.post(
  "/signup",
  /*
#swagger.tags = ['AUTH']
#swagger.summary = 'Sign Up'
#swagger.description = 'User sign up. To create new user'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - name, phn_num, Country_code, email, device_token, device_id, device_type",
  content: {
    "application/json": {
      example: {
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
