import express from "express";
import * as meetingcontroller from "../controller/meeting.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/addmember",
  /*
    #swagger.tags = ['3.Member']
    #swagger.summary = 'Add Member'
    #swagger.description = 'Add a new member'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_IFZu5632"
              },
              name: {
                type: "string",
                example: "paschal"
              },
              phn_num: {
                type: "string",
                example: "9487570100"
              },
              role_id: {
                type: "integer",
                example: 14
              },
              country: {
                type: "string",
                example: "India"
              },
              state: {
                type: "string",
                example: "Tamil Nadu"
              },
              district: {
                type: "string",
                example: "Coimbatore"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Member added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  meetingcontroller.addMembers,
);
router.post(
  "/getmember",
  /*
    #swagger.tags = ['3.Member']
    #swagger.summary = 'Get Member'
    #swagger.description = 'Get members by passing user_id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_IFZu5632"
              },
              role_id: {
                type: "string",
                example: "1"
              },
              district: {
                type: "array",
                items: {
                type: "string"
                },
                example: ["coimbatore", "salem", "palakkad"]
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Members fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  meetingcontroller.getMembers,
);
router.post(
  "/updatemember",
  /*
    #swagger.tags = ['3.Member']
    #swagger.summary = 'Update Member'
    #swagger.description = 'Update member details by passing id and fields to update'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 26
              },
              name: {
                type: "string",
                example: "paschal"
              },
              phn_num: {
                type: "string",
                example: "9487570100"
              },
              role_id: {
                type: "integer",
                example: 14
              },
              country: {
                type: "string",
                example: "Germany"
              },
              state: {
                type: "string",
                example: "Bavaria"
              },
              district: {
                type: "string",
                example: "Munich"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Member updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  meetingcontroller.updateMembers,
);
router.post(
  "/deletemember",
  /*
    #swagger.tags = ['3.Member']
    #swagger.summary = 'Delete Member'
    #swagger.description = 'Delete member by passing id'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 26
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Member deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/
  meetingcontroller.deleteMembers,
);

router.post(
  "/addmeeting",
  /*
    #swagger.tags = ['4.Meeting']
    #swagger.summary = 'Add Meeting'
    #swagger.description = 'Add a new meeting by passing required fields'

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
              title: {
                type: "string",
                example: "Meeting Title 100"
              },
              descp: {
                type: "string",
                example: "Meeting description"
              },
              m_type: {
                type: "integer",
                example: 0
              },
              m_priority: {
                type: "integer",
                example: 2
              },
              m_link: {
                type: "string",
                example: "https://meet.google.com/abc-defg-hij"
              },
              notes: {
                type: "string",
                example: "Meeting notes created for reference"
              },
              address: {
                type: "string",
                example: "10, Skyraan Building"
              },
              lat: {
                type: "string",
                example: "10.23456"
              },
              lng: {
                type: "string",
                example: "9.98765"
              },
              media_id: {
                type: "string",
                example: "1000,2,3,900,8999"
              },
              attnds_id: {
                type: "string",
                example: "1,3,4,5"
              },
              from_date: {
                type: "string",
                example: "2026-06-10 14:40:32"
              },
              to_date: {
                type: "string",
                example: "2026-06-10 14:40:32"
              },
              is_remind: {
                type: "integer",
                example: 1
              },
              remind_tenure: {
                type: "string",
                example: "300"
              },
              snooze_at: {
                type: "string",
                example: "180"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Meeting added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ meetingcontroller.addMeeting,
);
router.post(
  "/getmeeting",
  /*
    #swagger.tags = ['4.Meeting']
    #swagger.summary = 'Get Meeting'
    #swagger.description = 'Get meetings by passing user_id. Optionally pass status (upcoming, cancelled, completed, pending)'

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
              status: {
                type: "string",
                example: "pending,cancelled,completed"
              },
              from_date: {
                type: "string",
                example: "2026-06-12"
              },
              to_date: {
                type: "string",
                example: "2026-06-13"
              },
              page: {
                type: "number",
                example: 1
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Meetings fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ meetingcontroller.getMeeting,
);
router.post(
  "/deletemeeting",
  /*
    #swagger.tags = ['4.Meeting']
    #swagger.summary = 'Delete Meeting'
    #swagger.description = 'Delete meeting by passing id'

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
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Meeting deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ meetingcontroller.deleteMeeting,
);
router.post(
  "/updatemeeting",
  /*
    #swagger.tags = ['4.Meeting']
    #swagger.summary = 'Update Meeting'
    #swagger.description = 'Update meeting by passing id and other fields to update'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 8
              },
              title: {
                type: "string",
                example: "Meeting Title 100"
              },
              descp: {
                type: "string",
                example: "Meeting description"
              },
              m_type: {
                type: "integer",
                example: 0
              },
              m_priority: {
                type: "integer",
                example: 2
              },
              m_link: {
                type: "string",
                example: "https://meet.google.com/abc-defg-hij"
              },
              notes: {
                type: "string",
                example: "Meeting notes created for reference"
              },
              address: {
                type: "string",
                example: "10, Skyraan Building"
              },
              lat: {
                type: "string",
                example: "10.23456"
              },
              lng: {
                type: "string",
                example: "9.98765"
              },
              media_id: {
                type: "string",
                example: "1000,2,3,900,8999"
              },
              attnds_id: {
                type: "string",
                example: "1,3,4,5"
              },
              from_date: {
                type: "string",
                example: "2026-06-10 14:40:32"
              },
              to_date: {
                type: "string",
                example: "2026-06-10 14:40:32"
              },
              is_remind: {
                type: "integer",
                example: 1
              },
              remind_tenure: {
                type: "string",
                example: "300"
              },
              snooze_at: {
                type: "string",
                example: "180"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Meeting updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ meetingcontroller.updateMeeting,
);

router.post(
  "/addappointment",
  /*
    #swagger.tags = ['5.Appointment']
    #swagger.summary = 'Add Appointment'
    #swagger.description = 'Add appointment by passing user_id and other required fields'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                example: "USER_Z8bn0076"
              },
              title: {
                type: "string",
                example: "Booth Meeting"
              },
              a_type: {
                type: "string",
                example: "Public Meeting"
              },
              notes: {
                type: "string",
                example: "Regarding booth council meeting with ministers"
              },
              address: {
                type: "string",
                example: "10, Skyraan 101, FCI Road, Ganapathy"
              },
              lat: {
                type: "string",
                example: "10.23456"
              },
              lng: {
                type: "string",
                example: "9.98765"
              },
              media_id: {
                type: "string",
                example: "1,3,4,5,10"
              },
              con_name: {
                type: "string",
                example: "Modi"
              },
              con_desg: {
                type: "string",
                example: "Prime Minister"
              },
              from_date: {
                type: "string",
                example: "2026-06-16 14:40:32"
              },
              to_date: {
                type: "string",
                example: "2026-06-17 14:40:32"
              },
              is_remind: {
                type: "integer",
                example: 1
              },
              remind_tenure: {
                type: "string",
                example: "300"
              },
              snooze_at: {
                type: "string",
                example: "180"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Appointment added successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ meetingcontroller.addAppointment,
);
router.post(
  "/deleteappointment",
  /*
    #swagger.tags = ['5.Appointment']
    #swagger.summary = 'Delete Appointment'
    #swagger.description = 'Delete appointment by passing id'

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
      description: 'Appointment deleted successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ meetingcontroller.deleteAppointment,
);
router.post(
  "/getappointment",
  /*
    #swagger.tags = ['5.Appointment']
    #swagger.summary = 'Get Appointment'
    #swagger.description = 'Get appointments by passing user_id. Optionally pass status (upcoming, cancelled, completed, pending)'

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
              status: {
                type: "string",
                example: "pending,cancelled,completed"
              },
              from_date: {
                type: "string",
                example: "2026-06-12"
              },
              to_date: {
                type: "string",
                example: "2026-06-16"
              },
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Appointments fetched successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ meetingcontroller.getAppointment,
);
router.post(
  "/updateappointment",
  /*
    #swagger.tags = ['5.Appointment']
    #swagger.summary = 'Update Appointment'
    #swagger.description = 'Update appointment by passing id and other fields to update'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                example: 8
              },
              title: {
                type: "string",
                example: "Booth Meeting"
              },
              a_type: {
                type: "string",
                example: "Public Meeting"
              },
              notes: {
                type: "string",
                example: "Regarding booth council meeting with ministers"
              },
              address: {
                type: "string",
                example: "10, Skyraan 101, FCI Road, Ganapathy"
              },
              lat: {
                type: "string",
                example: "10.23456"
              },
              lng: {
                type: "string",
                example: "9.98765"
              },
              media_id: {
                type: "string",
                example: "1,3,4,5,10"
              },
              con_name: {
                type: "string",
                example: "Modi"
              },
              con_desg: {
                type: "string",
                example: "Prime Minister"
              },
              from_date: {
                type: "string",
                example: "2026-06-19 14:40:32"
              },
              to_date: {
                type: "string",
                example: "2026-06-19 18:40:32"
              },
              is_remind: {
                type: "integer",
                example: 1
              },
              remind_tenure: {
                type: "string",
                example: "300"
              },
              snooze_at: {
                type: "string",
                example: "180"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Appointment updated successfully'
    }

    #swagger.responses[500] = {
      description: 'Internal Server Error'
    }
*/ meetingcontroller.updateAppointment,
);

export default router;
