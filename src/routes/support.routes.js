import express from "express";
import * as supportController from "../controller/support.controller.js";

const router = express.Router();

router.post("/addfaq", supportController.addFaq);
router.post("/getfaq", supportController.getFaq);
router.post("/updatefaq", supportController.updateFaq);

router.post("/contact_us", supportController.contactUs);

router.post(
  "/filterapi",
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
  */ supportController.filterApi,
);

export default router;
