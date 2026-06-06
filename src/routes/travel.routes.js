import express from "express";
import * as travelcontroller from "../controller/travel.controller.js";

const router = express.Router();

// this is to add travel
router.post(
  "/addtravel",
  /*
#swagger.tags = ['TRAVEL']
#swagger.summary = 'Add travel'
#swagger.description = 'Add Travel'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id and the form fields",
  content: {
    "application/json": {
      example: {
        "user_id": "USER_ZNLl2665",
        "title": "Munnar trip",
        "descp": "three days two nights trip",
        "purpose": 0,
        "travel_from": "salem",
        "from_lat": "25.87575",
        "from_lng": "67.5443",
        "travel_to": "yercaud",
        "to_lat": "67.544",
        "to_lng": "78.655",
        "from_date": "2026-06-04 12:01:45",
        "to_date": "2026-06-04 13:01:45",
        "vech_mode": "car",
        "media_id": "1,2,3",
        "in_hotel": 1,
        "hot_name": "RHR",
        "hot_address": "Near junction",
        "hot_lat": "83.333",
        "hot_lng": "43.333",
        "hot_in": "2026-06-04 16:01:40",
        "hot_out": "2026-06-04 18:30:40",
        "hot_media": "5,6",
        "is_remind": 1,
        "remind_tenure": "600",
        "snooze_at": "120"
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
*/ travelcontroller.addTravel,
);
router.post(
  "/deletetravel",
  /*
#swagger.tags = ['TRAVEL']
#swagger.summary = 'DELETE travel'
#swagger.description = 'Delete Travel'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel id",
  content: {
    "application/json": {
      example: {
        "id": 2
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
*/ travelcontroller.deleteTravel,
);
router.post(
  "/updatetravel",
  /*
#swagger.tags = ['TRAVEL']
#swagger.summary = 'UPDATE travel'
#swagger.description = 'Update Travel'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - id and other form fields",
  content: {
    "application/json": {
      example: {
        "id": 10,
        "title": "ooty travel",
        "descp": "IV from college",
        "purpose": 1,
        "travel_from": "coimbatore",
        "from_lat": "70.33234",
        "from_lng": "60.123",
        "travel_to": "bangalore",
        "to_lat": "50.123",
        "to_lng": "50.321",
        "from_date": "2026-06-04 12:01:45",
        "to_date": "2026-06-05 21:30:45",
        "vech_mode": "train",
        "media_id": "1,2,3",
        "in_hotel": 1,
        "hot_name": "RHR",
        "hot_address": "Near junction",
        "hot_lat": "12.3433",
        "hot_lng": "10.3322",
        "hot_in": "2026-06-04 20:10:20",
        "hot_out": "2026-06-04 20:30:20",
        "hot_media": "1,2,3",
        "is_remind": 1,
        "remind_tenure": "600",
        "snooze_at": "120"
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
*/ travelcontroller.updateTravel,
);
router.post(
  "/gettravel",
  /*
#swagger.tags = ['TRAVEL']
#swagger.summary = 'GET travel'
#swagger.description = 'Get Travel'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id",
  content: {
    "application/json": {
      example: {
        "user_id": "USER_ZNLl2665",
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
*/ travelcontroller.getTravel,
);

// this is to add daily plan for specific travel
router.post(
  "/adddaily",
  /*
#swagger.tags = ['TRAVEL DAILY PLAN']
#swagger.summary = 'ADD DAILY PLAN'
#swagger.description = 'Add daily plan to a travel'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id, travel_id and other form fields",
  content: {
    "application/json": {
      example: {
        "user_id": "USER_Z8bn0076",
        "travel_id": 3,
        "from": "gandhipuram",
        "to": "prozone mall",
        "departure": "2026-06-04 15:30:30",
        "vech_mode": "train",
        "media_id": "1,2"
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
*/ travelcontroller.addDailyPlan,
);
router.post(
  "/updatedaily",
  /*
#swagger.tags = ['TRAVEL DAILY PLAN']
#swagger.summary = 'UPDATE DAILY PLAN'
#swagger.description = 'Update daily plan to a travel'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - daily plan id and other form fields",
  content: {
    "application/json": {
      example: {
        "id": 9,
        "from": "gandhipuram",
        "to": "prozone mall",
        "departure": "2026-06-04 15:30:30",
        "vech_mode": "flight",
        "media_id": "1,2"
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
*/ travelcontroller.updatedailyplan,
);
router.post(
  "/deletedaily",
  /*
#swagger.tags = ['TRAVEL DAILY PLAN']
#swagger.summary = 'DELETE DAILY PLAN'
#swagger.description = 'Delete daily plan to a travel'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - daily plan id",
  content: {
    "application/json": {
      example: {
        "id": 9
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
*/ travelcontroller.deleteDailyplan,
);

// this is to add travel expenses for specific travel
router.post(
  "/addexpense",
  /*
#swagger.tags = ['TRAVEL EXPENSE']
#swagger.summary = 'ADD TRAVEL EXPENSE'
#swagger.description = 'Add travel expense'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user id, travel id and other form fields",
  content: {
    "application/json": {
      example: {
        "user_id": "USER_ZNLl2665",
        "travel_id": 3,
        "category": "uss expense",
        "notes": "travelled in bus for meeting",
        "exp_date": "1780230601000",
        "amount": 87.89
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
*/ travelcontroller.addExpense,
);
router.post(
  "/deleteexpense",
  /*
#swagger.tags = ['TRAVEL EXPENSE']
#swagger.summary = 'DELETE TRAVEL EXPENSE'
#swagger.description = 'delete travel expense'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel expense id",
  content: {
    "application/json": {
      example: {
        "id": 3
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
*/ travelcontroller.deleteExpense,
);
router.post(
  "/updateexpense",
  /*
#swagger.tags = ['TRAVEL EXPENSE']
#swagger.summary = 'UPDATE TRAVEL EXPENSE'
#swagger.description = 'Update travel expense'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel expense id and other fields",
  content: {
    "application/json": {
      example: {
        "id": 3,
        "category": "uss expense",
        "notes": "travelled in bus for meeting",
        "exp_date": "2026-06-10 18:39:38",
        "amount": "100.00"
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
*/ travelcontroller.updateExpense,
);
router.post(
  "/getexpense",
  /*
#swagger.tags = ['TRAVEL EXPENSE']
#swagger.summary = 'GET TRAVEL EXPENSE'
#swagger.description = 'Get travel expense'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel id",
  content: {
    "application/json": {
      example: {
        "travel_id": 3,
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
*/ travelcontroller.getExpense,
);

// this is to add travel notes for specific travel
router.post(
  "/addnotes",
  /*
#swagger.tags = ['TRAVEL NOTES']
#swagger.summary = 'ADD TRAVEL NOTES'
#swagger.description = 'Add travel notes'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id, travel id and other form fields",
  content: {
    "application/json": {
      example: {
        "user_id": "USER_ZNLl2665",
        "travel_id": 4,
        "title": "met vijay regarding new posting",  
        "descp": "grathered party members and went to meet PM"
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
*/ travelcontroller.addNotes,
);
router.post(
  "/getnotes",
  /*
#swagger.tags = ['TRAVEL NOTES']
#swagger.summary = 'GET TRAVEL NOTES'
#swagger.description = 'Get travel notes'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel id",
  content: {
    "application/json": {
      example: {
        "travel_id": 10
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
*/ travelcontroller.getNotes,
);
router.post(
  "/updatenotes",
  /*
#swagger.tags = ['TRAVEL NOTES']
#swagger.summary = 'UPDATE TRAVEL NOTES'
#swagger.description = 'Update travel notes'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - id and other form fields",
  content: {
    "application/json": {
      example: {
        "user_id": "USER_ZNLl2665",
        "travel_id": 4,
        "title": "met vijay regarding new posting",  
        "descp": "grathered party members and went to meet PM"
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
*/ travelcontroller.updateNotes,
);
router.post(
  "/deletenotes",
  /*
#swagger.tags = ['TRAVEL NOTES']
#swagger.summary = 'DELETE TRAVEL NOTES'
#swagger.description = 'Delete travel notes'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - Notes id",
  content: {
    "application/json": {
      example: {
        "id": 3
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
*/ travelcontroller.deleteNotes,
);

// this is to add travel photos for specific travel,
router.post(
  "/addtravelphotos",
  /*
#swagger.tags = ['TRAVEL PHOTOS']
#swagger.summary = 'ADD TRAVEL PHOTOS'
#swagger.description = 'Add travel photos'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id, travel_id, media_id",
  content: {
    "application/json": {
      example: {
        "user_id": "USER_ZNLl2665",
        "travel_id": 10,
        "media_id": "1,2,3"
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
*/ travelcontroller.addTravelPhotos,
);
router.post(
  "/updatetravelphotos",
  /*
#swagger.tags = ['TRAVEL PHOTOS']
#swagger.summary = 'UPDATE TRAVEL PHOTOS'
#swagger.description = 'Update travel photos'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel_id, media_id",
  content: {
    "application/json": {
      example: {
        "id": 10,
        "media_id": "1,2,3"
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
*/ travelcontroller.updateTravelPhotos,
);
router.post(
  "/gettravelphotos",
  /*
#swagger.tags = ['TRAVEL PHOTOS']
#swagger.summary = 'GET TRAVEL PHOTOS'
#swagger.description = 'Get travel photos'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel_id",
  content: {
    "application/json": {
      example: {
        "travel_id": 10,
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
*/ travelcontroller.getTravelPhotos,
);
router.post(
  "/deletetravelphotos",
  /*
#swagger.tags = ['TRAVEL PHOTOS']
#swagger.summary = 'DELETE TRAVEL PHOTOS'
#swagger.description = 'Delete travel photos'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel_id and media_id",
  content: {
    "application/json": {
      example: {
        "travel_id": 10,
        "media_id": "15"
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
*/ travelcontroller.deleteTravelPhotos,
);

router.post(
  "/addtraveldocs",
  /*
#swagger.tags = ['TRAVEL Documents']
#swagger.summary = 'ADD TRAVEL DOCUMENTS'
#swagger.description = 'Add travel documents'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id, travel_id, media_id",
  content: {
    "application/json": {
      example: {
        "user_id": "USER_ZNLl2665",
        "travel_id": 10,
        "media_id": "1,2,3"
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
*/ travelcontroller.addTravelDocs,
);
router.post(
  "/updatetraveldocs",
  /*
#swagger.tags = ['TRAVEL Documents']
#swagger.summary = 'UPDATE TRAVEL DOCUMENTS'
#swagger.description = 'Update travel documents'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel_id, media_id",
  content: {
    "application/json": {
      example: {
        "travel_id": 10,
        "media_id": "1,2,3"
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
*/ travelcontroller.updateTravelDocs,
);
router.post(
  "/gettraveldocs",
  /*
#swagger.tags = ['TRAVEL Documents']
#swagger.summary = 'GET TRAVEL DOCUMENTS'
#swagger.description = 'Get travel documents'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel_id",
  content: {
    "application/json": {
      example: {
        "travel_id": 10,
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
*/ travelcontroller.getTravelDocs,
);
router.post(
  "/deletetraveldocs",
  /*
#swagger.tags = ['TRAVEL Documents']
#swagger.summary = 'DELETE TRAVEL DOCUMENTS'
#swagger.description = 'Delete travel documents'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - travel_id, media_id",
  content: {
    "application/json": {
      example: {
        "travel_id": 10,
        "media_id": "1,2,3"
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
*/ travelcontroller.deleteTravelDocs,
);

export default router;
