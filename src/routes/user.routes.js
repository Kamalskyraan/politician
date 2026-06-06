import express from "express";
import * as usercontroller from '../controller/user.controller.js'


const router = express.Router();

router.post("/getuserprofile", usercontroller.getUserProfile);
router.post("/updateuserprofile", usercontroller.updateProfileDetail);

export default router;