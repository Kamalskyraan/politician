import express from "express";
import * as meetingcontroller from "../controller/meeting.controller.js";

const router = express.Router();

router.post(
  "/addmember",
  /*
#swagger.tags = ['MEMBER']
#swagger.summary = 'Add member'
#swagger.description = 'Add members required fields'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id, name, phn_num, role_id, country, state, district",
  content: {
    "application/json": {
      example: {
        user_id: "USER_IFZu5632",
        name: "paschal",
        phn_num: "9487570100",
        role_id: 14,
        country: "german",
        state: "diffasgune",
        district: "naattingham"
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
*/ meetingcontroller.addMembers,
);
router.post(
  "/getmember",
  /*
#swagger.tags = ['MEMBER']
#swagger.summary = 'Get member'
#swagger.description = 'Get members by passing user_id'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id",
  content: {
    "application/json": {
      example: {
        user_id: "USER_IFZu5632"
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
*/ meetingcontroller.getMembers,
);
router.post(
  "/updatemember",
  /*
#swagger.tags = ['MEMBER']
#swagger.summary = 'Update member'
#swagger.description = 'Update members by passing id and other fields to update'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - id, name, phn_num, role_id, country, state, district",
  content: {
    "application/json": {
      example: {
        id: 26,
        name: "paschal",
        phn_num: "9487570100",
        role_id: 14,
        country: "german",
        state: "diffasgune",
        district: "naattingham"
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
*/ meetingcontroller.updateMembers,
);
router.post(
  "/deletemember",
  /*
#swagger.tags = ['MEMBER']
#swagger.summary = 'delete member'
#swagger.description = 'Delete members by passing id'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - id",
  content: {
    "application/json": {
      example: {
        id: 26
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
*/ meetingcontroller.deleteMembers,
);

router.post(
  "/addmeeting",
  /*
#swagger.tags = ['MEETING']
#swagger.summary = 'Add meeting'
#swagger.description = 'Add meeting by passing required fields'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id, title, description, meeting_type, meeting_priority, meeting_link, notes, address, lat, lng, media_id, attnds_id, from_date, to_date, is_remind, remind_tenure, snooze_at",
  content: {
    "application/json": {
      example: {
        "user_id": "USER_efKL6767",
        title:"meeting title 100",
        descp: "meeting desc",
        m_type: 0,
        m_priority: 2,
        m_link: "asdsa",
        notes: "m notes is created for reference",
        address: "10, skyraan building",
        lat: 10.23456,
        lng: 9.98765,
        media_id: "1000,2,3,900,8999",
        attnds_id: "1,3,4,5,5",
        from_date: "1779447600000",
        to_date: "1779449400000",
        is_remind: 1,
        remind_tenure: 300,
        snooze_at: 180
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
*/ meetingcontroller.addMeeting,
);
router.post(
  "/getmeeting",
  /*
#swagger.tags = ['MEETING']
#swagger.summary = 'Get meeting'
#swagger.description = 'Get meeting by passing user_id, pass with status if need by status -upcoming, cancelled, completed, pending'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id, status",
  content: {
    "application/json": {
      example: {
        user_id: "USER_efKL6767",
        status: "pending"
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
*/ meetingcontroller.getMeeting,
);
router.post(
  "/deletemeeting",
  /*
#swagger.tags = ['MEETING']
#swagger.summary = 'Delete meeting'
#swagger.description = 'Delete meeting by passing id'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - id",
  content: {
    "application/json": {
      example: {
        id: 10
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
*/ meetingcontroller.deleteMeeting,
);
router.post(
  "/updatemeeting",
  /*
#swagger.tags = ['MEETING']
#swagger.summary = 'Update meeting'
#swagger.description = 'Update meeting by passing id and other fields to update'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - id,title,descp,m_type,m_priority,m_link,notes,address,lat,lng,status,media_id, attnds_id, from_date, to_date, is_remind, remind_tenure, snooze_at
      attnds_id,
      from_date,
      to_date,
      is_remind,
      remind_tenure,
      snooze_at,",
  content: {
    "application/json": {
      example: {
        id: 8,
        title:"meeting title 100",
        descp: "meeting desc",
        m_type: 0,
        m_priority: 2,
        m_link: "asdsa",
        notes: "m notes is created for reference",
        address: "10, skyraan building",
        lat: 10.23456,
        lng: 9.98765,
        media_id: "1000,2,3,900,8999",
        attnds_id: "1,3,4,5,5",
        from_date: "1779447600000",
        to_date: "1779449400000",
        is_remind: 1,
        remind_tenure: 300,
        snooze_at: 180
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
*/ meetingcontroller.updateMeeting,
);

router.post(
  "/addappointment",
  /*
#swagger.tags = ['APPOINTMENT']
#swagger.summary = 'Add appointment'
#swagger.description = 'Add appointment by passing user_id and other fields'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id,
      title,
      a_type,
      notes,
      address,
      lat,
      lng,
      media_id,
      con_name,
      con_desg,
      from_date,
      to_date,
      is_remind,
      remind_tenure,
      snooze_at,
      attnds_id,
      from_date,
      to_date,
      is_remind,
      remind_tenure,
      snooze_at,",
  content: {
    "application/json": {
      example: {
        "user_id": "USER_Z8bn0076",
        title: "booth meeting",
        a_type: "public meeting",
        notes: "regarding booth council meeting with ministers",
        address: "10, skyraan 101, FCI road ganapathy",
        lat: 10.23456,
        lng: 9.98765,
        media_id: "1,3,4,5,10,11",
        con_name: "modi",
        con_desg: "prime minister",
        from_date: "1779787800000",
        to_date: "1779798600000",
        is_remind: 1,
        remind_tenure: 300,
        snooze_at: 180
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
*/ meetingcontroller.addAppointment,
);
router.post(
  "/deleteappointment",
  /*
#swagger.tags = ['APPOINTMENT']
#swagger.summary = 'Delete appointment'
#swagger.description = 'Delete appointment by passing id'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - id",
  content: {
    "application/json": {
      example: {
        id: 3
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
*/ meetingcontroller.deleteAppointment,
);
router.post(
  "/getappointment",
  /*
#swagger.tags = ['APPOINTMENT']
#swagger.summary = 'Get appointment'
#swagger.description = 'Get appointment by passing user_id, pass with status if needed by status -upcoming, cancelled, completed, pending'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id, status",
  content: {
    "application/json": {
      example: {
        user_id: "USER_efKL6767",
        status: "pending"
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
*/ meetingcontroller.getAppointment,
);
router.post(
  "/updateappointment",
  /*
#swagger.tags = ['APPOINTMENT']
#swagger.summary = 'Update appointment'
#swagger.description = 'Update appointment by passing id and other fields to update'

#swagger.requestBody = {    
  required: true,
  description: "Required fields - user_id,
      title,
      a_type,
      notes,
      address,
      lat,
      lng,
      media_id,
      con_name,
      con_desg,
      from_date,
      to_date,
      is_remind,
      remind_tenure,
      snooze_at,
      attnds_id,
      from_date,
      to_date,
      is_remind,
      remind_tenure,
      snooze_at,",
  content: {
    "application/json": {
      example: {
        id: 8,
        title: "booth meeting",
        a_type: "public meeting",
        notes: "regarding booth council meeting with ministers",
        address: "10, skyraan 101, FCI road ganapathy",
        lat: 10.23456,
        lng: 9.98765,
        media_id: "1,3,4,5,10,11",
        con_name: "modi",
        con_desg: "prime minister",
        from_date: "1779787800000",
        to_date: "1779798600000",
        is_remind: 1,
        remind_tenure: 300,
        snooze_at: 180
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
*/ meetingcontroller.updateAppointment,
);

router.post("/reminder", meetingcontroller.reminder);

export default router;
