import express from "express";
import * as supportController from "../controller/support.controller.js";

const router = express.Router();

router.post("/addfaq", supportController.addFaq);
router.post("/getfaq", supportController.getFaq);
router.post("/updatefaq", supportController.updateFaq);

router.post("/contact_us", supportController.contactUs);

router.post("/filterapi", supportController.filterApi);
router.post("/getcountry", supportController.getCountries);

export default router;
