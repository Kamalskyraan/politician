import express from "express";
import * as travelcontroller from "../controller/travel.controller.js";

const router = express.Router();

// this is to add travel
router.post(
  "/addtravel",
  /*
    #swagger.tags = ['6.TRAVEL']
    #swagger.summary = 'Add Travel'
    #swagger.description = 'Add a new travel plan'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_ZNLl2665"
              },
              title: {
                type: "string",
                example: "Munnar Trip"
              },
              descp: {
                type: "string",
                example: "Three days two nights trip"
              },
              purpose: {
                type: "integer",
                example: 0
              },
              travel_from: {
                type: "string",
                example: "Salem"
              },
              from_lat: {
                type: "string",
                example: "25.87575"
              },
              from_lng: {
                type: "string",
                example: "67.5443"
              },
              travel_to: {
                type: "string",
                example: "Yercaud"
              },
              to_lat: {
                type: "string",
                example: "67.544"
              },
              to_lng: {
                type: "string",
                example: "78.655"
              },
              from_date: {
                type: "string",
                example: "2026-06-04 12:01:45"
              },
              to_date: {
                type: "string",
                example: "2026-06-04 13:01:45"
              },
              vech_mode: {
                type: "string",
                example: "car"
              },
              media_id: {
                type: "string",
                example: "1,2,3"
              },
              in_hotel: {
                type: "integer",
                example: 1
              },
              hot_name: {
                type: "string",
                example: "RHR"
              },
              hot_address: {
                type: "string",
                example: "Near Junction"
              },
              hot_lat: {
                type: "string",
                example: "83.333"
              },
              hot_lng: {
                type: "string",
                example: "43.333"
              },
              hot_in: {
                type: "string",
                example: "2026-06-04 16:01:40"
              },
              hot_out: {
                type: "string",
                example: "2026-06-04 18:30:40"
              },
              hot_media: {
                type: "string",
                example: "5,6"
              },
              is_remind: {
                type: "integer",
                example: 1
              },
              remind_tenure: {
                type: "string",
                example: "600"
              },
              snooze_at: {
                type: "string",
                example: "120"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.addTravel,
);
router.post(
  "/deletetravel",
  /*
    #swagger.tags = ['6.TRAVEL']
    #swagger.summary = 'Delete Travel'
    #swagger.description = 'Delete travel by passing id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 2
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.deleteTravel,
);
router.post(
  "/updatetravel",
  /*
    #swagger.tags = ['6.TRAVEL']
    #swagger.summary = 'Update Travel'
    #swagger.description = 'Update travel by passing id and other fields to update'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 10
              },
              title: {
                type: "string",
                example: "Ooty Travel"
              },
              descp: {
                type: "string",
                example: "IV from college"
              },
              purpose: {
                type: "integer",
                example: 1
              },
              travel_from: {
                type: "string",
                example: "Coimbatore"
              },
              from_lat: {
                type: "string",
                example: "70.33234"
              },
              from_lng: {
                type: "string",
                example: "60.123"
              },
              travel_to: {
                type: "string",
                example: "Bangalore"
              },
              to_lat: {
                type: "string",
                example: "50.123"
              },
              to_lng: {
                type: "string",
                example: "50.321"
              },
              from_date: {
                type: "string",
                example: "2026-06-04 12:01:45"
              },
              to_date: {
                type: "string",
                example: "2026-06-05 21:30:45"
              },
              vech_mode: {
                type: "string",
                example: "train"
              },
              media_id: {
                type: "string",
                example: "1,2,3"
              },
              in_hotel: {
                type: "integer",
                example: 1
              },
              hot_name: {
                type: "string",
                example: "RHR"
              },
              hot_address: {
                type: "string",
                example: "Near Junction"
              },
              hot_lat: {
                type: "string",
                example: "12.3433"
              },
              hot_lng: {
                type: "string",
                example: "10.3322"
              },
              hot_in: {
                type: "string",
                example: "2026-06-04 20:10:20"
              },
              hot_out: {
                type: "string",
                example: "2026-06-04 20:30:20"
              },
              hot_media: {
                type: "string",
                example: "1,2,3"
              },
              is_remind: {
                type: "integer",
                example: 1
              },
              remind_tenure: {
                type: "string",
                example: "600"
              },
              snooze_at: {
                type: "string",
                example: "120"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.updateTravel,
);
router.post(
  "/gettravel",
  /*
    #swagger.tags = ['6.TRAVEL']
    #swagger.summary = 'Get Travel'
    #swagger.description = 'Get travel details by passing user_id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_ZNLl2665"
              },
              from_date: {
                type: "string",
                example: "2026-06-12"
              },
              to_date: {
                type: "string",
                example: "2026-06-19"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel details fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.getTravel,
);

// this is to add daily plan for specific travel
router.post(
  "/adddaily",
  /*
    #swagger.tags = ['6.1.TRAVEL DAILY PLAN']
    #swagger.summary = 'Add Daily Plan'
    #swagger.description = 'Add a daily plan to a travel'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              travel_id: {
                type: "integer",
                example: 3
              },
              from: {
                type: "string",
                example: "Gandhipuram"
              },
              to: {
                type: "string",
                example: "Prozone Mall"
              },
              departure: {
                type: "string",
                example: "2026-06-04 15:30:30"
              },
              vech_mode: {
                type: "string",
                example: "train"
              },
              media_id: {
                type: "string",
                example: "1,2"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Daily plan added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.addDailyPlan,
);
router.post(
  "/updatedaily",
  /*
    #swagger.tags = ['6.1.TRAVEL DAILY PLAN']
    #swagger.summary = 'Update Daily Plan'
    #swagger.description = 'Update a daily plan by passing id and other fields to update'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 9
              },
              from: {
                type: "string",
                example: "Gandhipuram"
              },
              to: {
                type: "string",
                example: "Prozone Mall"
              },
              departure: {
                type: "string",
                example: "2026-06-04 15:30:30"
              },
              vech_mode: {
                type: "string",
                example: "flight"
              },
              media_id: {
                type: "string",
                example: "1,2"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Daily plan updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.updatedailyplan,
);
router.post(
  "/deletedaily",
  /*
    #swagger.tags = ['6.1.TRAVEL DAILY PLAN']
    #swagger.summary = 'Delete Daily Plan'
    #swagger.description = 'Delete a daily plan by passing id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 9
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Daily plan deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.deleteDailyplan,
);

// this is to add travel expenses for specific travel
router.post(
  "/addexpense",
  /*
    #swagger.tags = ['6.2.TRAVEL EXPENSE']
    #swagger.summary = 'Add Travel Expense'
    #swagger.description = 'Add a travel expense'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              travel_id: {
                type: "integer",
                example: 3
              },
              cat_id: {
                type: "number",
                example: 2
              },
              cat_name: {
                type: "string",
                example: "others"
              },
              notes: {
                type: "string",
                example: "Travelled in bus for meeting"
              },
              exp_date: {
                type: "string",
                example: "2026-06-22 10:23:31"
              },
              amount: {
                type: "string",
                example: "87.89"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel expense added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.addExpense,
);
router.post(
  "/deleteexpense",
  /*
    #swagger.tags = ['6.2.TRAVEL EXPENSE']
    #swagger.summary = 'Delete Travel Expense'
    #swagger.description = 'Delete a travel expense by passing id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 3
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel expense deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.deleteExpense,
);
router.post(
  "/updateexpense",
  /*
    #swagger.tags = ['6.2.TRAVEL EXPENSE']
    #swagger.summary = 'Update Travel Expense'
    #swagger.description = 'Update a travel expense by passing id and other fields to update'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 3
              },
              cat_id: {
                type: "number",
                example: 2
              },
              cat_name: {
                type: "string",
                example: "others"
              },
              notes: {
                type: "string",
                example: "Travelled in bus for meeting"
              },
              exp_date: {
                type: "string",
                example: "2026-06-10 18:39:38"
              },
              amount: {
                type: "string",
                example: "100.00"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel expense updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.updateExpense,
);
router.post(
  "/getexpense",
  /*
    #swagger.tags = ['6.2.TRAVEL EXPENSE']
    #swagger.summary = 'Get Travel Expense'
    #swagger.description = 'Get travel expenses by passing travel_id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              travel_id: {
                type: "integer",
                example: 3
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel expenses fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.getExpense,
);
router.post(
  "/gettravelexpensecategories",
  /*
    #swagger.tags = ['16.Dashboard Api`s']
    #swagger.summary = 'Get travel expense categories'
    #swagger.description = 'Get travel expense categories'

    #swagger.responses[200] = {
      description: 'travel expense categories fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  travelcontroller.travelExpenseCategory,
);

// this is to add travel notes for specific travel
router.post(
  "/addnotes",
  /*
    #swagger.tags = ['6.3.TRAVEL NOTES']
    #swagger.summary = 'Add Travel Notes'
    #swagger.description = 'Add notes for a travel'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              travel_id: {
                type: "integer",
                example: 4
              },
              title: {
                type: "string",
                example: "Met Vijay Regarding New Posting"
              },
              descp: {
                type: "string",
                example: "Gathered party members and went to meet PM"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel notes added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.addNotes,
);
router.post(
  "/getnotes",
  /*
    #swagger.tags = ['6.3.TRAVEL NOTES']
    #swagger.summary = 'Get Travel Notes'
    #swagger.description = 'Get travel notes by passing travel_id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              travel_id: {
                type: "integer",
                example: 10
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel notes fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.getNotes,
);
router.post(
  "/updatenotes",
  /*
    #swagger.tags = ['6.3.TRAVEL NOTES']
    #swagger.summary = 'Update Travel Notes'
    #swagger.description = 'Update travel notes by passing id and other fields to update'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 4
              },
              title: {
                type: "string",
                example: "Met Vijay Regarding New Posting"
              },
              descp: {
                type: "string",
                example: "Gathered party members and went to meet PM"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel notes updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.updateNotes,
);
router.post(
  "/deletenotes",
  /*
    #swagger.tags = ['6.3.TRAVEL NOTES']
    #swagger.summary = 'Delete Travel Notes'
    #swagger.description = 'Delete travel notes by passing id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 3
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel notes deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.deleteNotes,
);

// this is to add travel photos for specific travel,
router.post(
  "/addtravelphotos",
  /*
    #swagger.tags = ['6.4.TRAVEL PHOTOS']
    #swagger.summary = 'Add Travel Photos'
    #swagger.description = 'Add photos to a travel'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              travel_id: {
                type: "integer",
                example: 10
              },
              media_id: {
                type: "string",
                example: "1,2,3"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel photos added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.addTravelPhotos,
);
router.post(
  "/updatetravelphotos",
  /*
    #swagger.tags = ['6.4.TRAVEL PHOTOS']
    #swagger.summary = 'Update Travel Photos'
    #swagger.description = 'Update travel photos by passing id and media_id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 10
              },
              media_id: {
                type: "string",
                example: "1,2,3"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel photos updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.updateTravelPhotos,
);
router.post(
  "/gettravelphotos",
  /*
    #swagger.tags = ['6.4.TRAVEL PHOTOS']
    #swagger.summary = 'Get Travel Photos'
    #swagger.description = 'Get travel photos by passing travel_id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              travel_id: {
                type: "integer",
                example: 10
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Travel photos fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ travelcontroller.getTravelPhotos,
);
router.post(
  "/deletetravelphotos",
  /*
#swagger.tags = ['6.4.TRAVEL PHOTOS']
#swagger.summary = 'DELETE TRAVEL PHOTOS'
#swagger.description = 'Delete travel photos by passing travel id and media id'

#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          travel_id: {
            type: "integer",
            example: 10
          },
          media_id: {
            type: "string",
            example: "15"
          }
        }
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Travel photos deleted successfully'
}

#swagger.responses[500] = {
  description: 'Internal Server Error'
}
*/ travelcontroller.deleteTravelPhotos,
);

router.post(
  "/addtraveldocs",
  /*
#swagger.tags = ['6.5.TRAVEL Documents']
#swagger.summary = 'ADD TRAVEL DOCUMENTS'
#swagger.description = 'Add travel documents'

#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          travel_id: {
            type: "integer",
            example: 10
          },
          media_id: {
            type: "string",
            example: "1,2,3"
          }
        }
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Travel documents added successfully'
}

#swagger.responses[500] = {
  description: 'Internal Server Error'
}
*/ travelcontroller.addTravelDocs,
);
router.post(
  "/updatetraveldocs",
  /*
#swagger.tags = ['6.5.TRAVEL Documents']
#swagger.summary = 'UPDATE TRAVEL DOCUMENTS'
#swagger.description = 'Update travel documents by passing travel id and other update fields'

#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          travel_id: {
            type: "integer",
            example: 10
          },
          media_id: {
            type: "string",
            example: "1,2,3"
          }
        }
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Travel documents updated successfully'
}

#swagger.responses[500] = {
  description: 'Internal Server Error'
}
*/ travelcontroller.updateTravelDocs,
);
router.post(
  "/gettraveldocs",
  /*
#swagger.tags = ['6.5.TRAVEL Documents']
#swagger.summary = 'GET TRAVEL DOCUMENTS'
#swagger.description = 'Get travel documents by passing travel id'

#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          travel_id: {
            type: "integer",
            example: 10
          }
        }
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Travel documents fetched successfully'
}

#swagger.responses[500] = {
  description: 'Internal Server Error'
}
*/ travelcontroller.getTravelDocs,
);
router.post(
  "/deletetraveldocs",
  /*
#swagger.tags = ['6.5.TRAVEL Documents']
#swagger.summary = 'DELETE TRAVEL DOCUMENTS'
#swagger.description = 'Delete travel documents by passing travel id and media id'

#swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          travel_id: {
            type: "integer",
            example: 10
          },
          media_id: {
            type: "string",
            example: "1,2,3"
          }
        }
      }
    }
  }
}

#swagger.responses[200] = {
  description: 'Travel documents deleted successfully'
}

#swagger.responses[500] = {
  description: 'Internal Server Error'
}
*/ travelcontroller.deleteTravelDocs,
);

export default router;
