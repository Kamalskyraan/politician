import express from "express";
import * as travelcontroller from '../controller/travel.controller.js'

const router = express.Router();

// this is to add travel
router.post("/addtravel", travelcontroller.addTravel);
router.post("/deletetravel", travelcontroller.deleteTravel);
router.post("/updatetravel", travelcontroller.updateTravel);
router.post("/gettravel", travelcontroller.getTravel);

// this is to add daily plan for specific travel
router.post("/adddaily", travelcontroller.addDailyPlan);
router.post("/updatedaily", travelcontroller.updatedailyplan);
router.post("/deletedaily", travelcontroller.deleteDailyplan);

// this is to add travel expenses for specific travel
router.post("/addexpense", travelcontroller.addExpense);
router.post("/deleteexpense", travelcontroller.deleteExpense);
router.post("/updateexpense", travelcontroller.updateExpense);
router.post("/getexpense", travelcontroller.getExpense);

router.post("/addnotes", travelcontroller.addNotes);
router.post("/getnotes", travelcontroller.getNotes);
router.post("/updatenotes", travelcontroller.updateNotes);
router.post("/deletenotes", travelcontroller.deleteNotes);

router.post("/addtravelphotos", travelcontroller.addTravelPhotos);
router.post("/updatetravelphotos", travelcontroller.updateTravelPhotos);
router.post("/gettravelphotos", travelcontroller.getTravelPhotos);
// router.post("/deletetravelphotos", travelcontroller.deleteTravelPhotos);

router.post("/addtraveldocs", travelcontroller.addTravelDocs);
router.post("/updatetraveldocs", travelcontroller.updateTravelDocs);
router.post("/gettraveldocs", travelcontroller.getTravelDocs);

export default router;
