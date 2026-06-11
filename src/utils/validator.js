import Joi from "joi";

export const validateRequest = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: true,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((err) => err.message).join(", ");
    const errorObject = new Error("validation Error");
    errorObject.status = 200;
    errorObject.errors = errorMessages;
    return { success: 0, errorObject };
  }
  return { success: 1, value };
};

export const validateRequests = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: true,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((err) => err.message).join(", ");
    const errorObject = new Error("validation Error");
    errorObject.status = 200;
    errorObject.errors = errorMessages;
    throw errorObject;
  }
  return value;
};

export const requestOtpSchema = Joi.object({
  phn_num: Joi.string()
    .min(10)
    .max(15)
    .pattern(/^(\+91[6-9]\d{9}|[6-9]\d{9})$/)
    .messages({
      "any.required": "Mobile number is required",
      "string.empty": "Mobile number is required",
      "string.min": "Mobile number must be at least 10 digits",
      "string.max": "Mobile number must not exceed 15 digits",
      "string.pattern.base": "Mobile number must start with 6-9",
    }),
  email: Joi.string().min(13).max(100).email().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.min": "Email must be at least 3 chars",
    "string.max": "Email must not exceed 100 chars",
  }),
  type: Joi.number()
    .valid(0, 1, 2) // restrict to allowed values
    .required()
    .messages({
      "any.required": "Type is required",
      "any.only": "Type must be 0, 1, or 2",
    }),
  c_code: Joi.string()
    .pattern(/^\+\d{2,3}$/)
    .optional(),
})
  .or("phn_num", "email")
  .messages({
    "object.missing": "Either mobile or email is required",
  });

export const verifyOtpSchema = Joi.object({
  phn_num: Joi.string()
    .min(10)
    .max(15)
    .pattern(/^(\+91[6-9]\d{9}|[6-9]\d{9})$/)
    .optional()
    .messages({
      "any.required": "Mobile number is required",
      "string.empty": "Mobile number is required",
      "string.min": "Mobile number must be at least 10 digits",
      "string.max": "Mobile number must not exceed 15 digits",
      "string.pattern.base": "Mobile number must start with 6-9",
    }),
  email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .min(13)
    .max(100)
    .optional()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.pattern.base": "Please enter a valid email address",
      "string.min": "Email must be at least 3 chars",
      "string.max": "Email must not exceed 100 chars",
    }),
  c_code: Joi.string().optional(),

  otp: Joi.string().length(4).required().messages({
    "string.length": "OTP must be exactly 4 digits",
    "any.required": "OTP is required",
  }),
});

export const signUpSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "any.required": "Name is required",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 100 characters",
  }),
  phn_num: Joi.string()
    .min(10)
    .max(15)
    .pattern(/^(\+91[6-9]\d{9}|[6-9]\d{9})$/)
    .required()
    .messages({
      "any.required": "Mobile number is required",
      "string.empty": "Mobile number is required",
      "string.min": "Mobile number must be at least 10 digits",
      "string.max": "Mobile number must not exceed 15 digits",
      "string.pattern.base": "Mobile number must start with 6-9",
    }),
  c_code: Joi.string()
    .pattern(/^\+\d{2,3}$/)
    .required(),
  email: Joi.string().min(13).max(100).required().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.min": "Email must be at least 3 chars",
    "string.max": "Email must not exceed 100 chars",
  }),
  device_token: Joi.string().min(1).max(255).required().messages({
    "any.required": "Device token is required",
    "string.empty": "Device token is required",
    "string.min": "Device token cannot be empty",
    "string.max": "Device token too long",
  }),
  device_id: Joi.string().min(1).max(255).required().messages({
    "any.required": "Device ID is required",
    "string.empty": "Device ID is required",
    "string.min": "Device ID cannot be empty",
    "string.max": "Device ID too long",
  }),
  device_type: Joi.string().valid("ios", "android", "web").required().messages({
    "any.required": "Device type is required",
    "string.empty": "Device type is required",
    "any.only": "Device type must be one of: ios, android, web",
  }),
});

export const loginschema = Joi.object({
  email: Joi.string().min(13).max(100).required().messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.min": "Email must be at least 3 chars",
    "string.max": "Email must not exceed 100 chars",
  }),
  device_token: Joi.string().min(1).max(255).required().messages({
    "any.required": "Device token is required",
    "string.empty": "Device token is required",
    "string.min": "Device token cannot be empty",
    "string.max": "Device token too long",
  }),
  device_id: Joi.string().min(1).max(255).required().messages({
    "any.required": "Device ID is required",
    "string.empty": "Device ID is required",
    "string.min": "Device ID cannot be empty",
    "string.max": "Device ID too long",
  }),
  device_type: Joi.string().valid("ios", "android", "web").required().messages({
    "any.required": "Device type is required",
    "string.empty": "Device type is required",
    "any.only": "Device type must be one of: ios, android, web",
  }),
});

export const updateUserProfileschema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.required": "user Id required",
  }),
  name: Joi.string().min(2).max(100).messages({
    "any.required": "Name is required",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 100 characters",
  }),
  phn_num: Joi.string()
    .min(10)
    .max(15)
    .pattern(/^(\+91[6-9]\d{9}|[6-9]\d{9})$/)
    .messages({
      "any.required": "Mobile number is required",
      "string.empty": "Mobile number is required",
      "string.min": "Mobile number must be at least 10 digits",
      "string.max": "Mobile number must not exceed 15 digits",
      "string.pattern.base": "Mobile number must start with 6-9",
    }),
  c_code: Joi.string()
    .pattern(/^\+\d{2,3}$/)
    .optional(),
  email: Joi.string().min(13).max(100).messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.min": "Email must be at least 3 chars",
    "string.max": "Email must not exceed 100 chars",
  }),
});

export const getUserProfileschema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.required": "Provide user id",
  }),
});

export const contactUsSchema = Joi.object({
  comments: Joi.string().required().min(10).max(250).messages({
    "string.required": "comments required. cannot be empty",
    "string.min": "minimum 10 chars needed",
    "string.max": "max 250 chars allowed",
  }),
});

export const addMemberSchema = Joi.object({
  user_id: Joi.string().required().length(13).messages({
    "string.string": "user Id should be a string",
    "string.required": "user Id cannot be empty",
    "string.length": "user Id should be in appropriate length",
  }),
  role_id: Joi.number().required().messages({
    "string.required": "role id is required",
    "string.number": "role id should be string",
    "string.empty": "role id should not be empty",
  }),
  name: Joi.string().min(2).max(100).required().messages({
    "any.required": "Name is required",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 100 characters",
  }),
  phn_num: Joi.string()
    .min(10)
    .max(15)
    .required()
    .pattern(/^(\+91[6-9]\d{9}|[6-9]\d{9})$/)
    .messages({
      "any.required": "Mobile number is required",
      "string.empty": "Mobile number is required",
      "string.min": "Mobile number must be at least 10 digits",
      "string.max": "Mobile number must not exceed 15 digits",
      "string.pattern.base": "Mobile number must start with 6-9",
    }),
  country: Joi.string().required().messages({
    "string.base": "country should be a string",
    "any.required": "country is required",
  }),
  state: Joi.string().required().messages({
    "string.base": "state should be a string",
    "any.required": "state is required",
  }),
  district: Joi.string().required().min(2).messages({
    "string.string": "district should be a given in string",
    "string.required": "district field cannot be empty",
    "string.min": "district should be atleast minimum 2 chars",
  }),
});
export const updateMemberSchema = Joi.object({
  id: Joi.number().required().messages({
    "any.required": "id is required",
    "number.base": "id should be number",
  }),
  role_id: Joi.number().required().messages({
    "any.required": "role id is required",
    "string.base": "role id should be string",
  }),
  name: Joi.string().required().messages({
    "any.required": "Name is required",
    "string.base": "Name is should be string",
  }),
  phn_num: Joi.string().required().messages({
    "any.required": "Name is required",
    "string.base": "Name is should be string",
  }),
  country: Joi.string().required().messages({
    "string.base": "country should be a string",
    "any.required": "country is required",
  }),
  state: Joi.string().required().messages({
    "string.base": "state should be a string",
    "any.required": "state is required",
  }),
  district: Joi.string().required().messages({
    "string.base": "district should be a given in string",
    "any.required": "district field cannot be empty",
  }),
});
export const deleteMemberSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "id must be an integer",
    "any.required": "id is required",
    "any.empty": "id should not be empty",
  }),
});

export const getMemberschema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "user Id should be a string",
    "any.required": "user Id cannot be empty",
  }),
  role_id: Joi.number().allow("").messages({
    "number.base": "role id should be a number",
    "any.required": "role id cannot be empty",
  }),
  district: Joi.array()
    .items(
      Joi.string().messages({
        "string.base": "district should be a string",
      }),
    )
    .required()
    .messages({
      "string.base": "district should be a array",
      "any.required": "district cannot be empty",
    }),
});

export const addMeetingSchema = Joi.object({
  user_id: Joi.string().required().length(13).messages({
    "string.base": "user Id should be a string",

    "string.length": "user Id should be in appropriate length",
    "any.required": "USER ID is required",
  }),
  title: Joi.string().max(30).required().messages({
    "string.string": "title should be a given in string",
    "string.required": "title field cannot be empty",
    "string.max": "title should be atleast maximum 30 chars",
  }),
  descp: Joi.string().max(250).required().messages({
    "string.string": "description should be a given in string",
    "string.required": "description field cannot be empty",
    "string.max": "description should be atleast maximum 250 chars",
  }),
  m_type: Joi.number().valid(0, 1).required().messages({
    "number.only": "0 and 1 only allowed",
    "number.required": "meeting type is required",
    "number.base": "meeting type should be a number",
  }),
  m_priority: Joi.number().valid(0, 1, 2).required().messages({
    "number.only": "0, 1, 2 only allowed",
    "number.required": "meeting priority is required",
    "number.base": "meeting priority should be a number",
  }),
  m_link: Joi.string().allow("").optional().messages({
    "string.string": "meeeting link should be a string",
  }),
  notes: Joi.string().max(150).allow("").optional().messages({
    "string.string": "meeeting link should be a string",
    "string.max": "meeeting link should be a under or exactly 150 chars",
  }),
  address: Joi.string().allow("").optional().messages({
    "string.string": "meeeting link should be a string",
  }),
  lat: Joi.string()
    .pattern(/^(-?[0-9]{1,2})(\.[0-9]{1,6})?$/)
    .allow("")
    .messages({
      "string.pattern.base":
        "Latitude must be a valid decimal value with up to 6 decimal places",
    }),
  lng: Joi.string()
    .pattern(/^(-?[0-9]{1,3})(\.[0-9]{1,6})?$/)
    .allow("")
    .messages({
      "string.pattern.base":
        "Longitude must be a valid decimal value with up to 6 decimal places",
    }),
  media_id: Joi.string()
    .pattern(/^\d+(,\d+)*$/) // only digits separated by commas
    .optional()
    .allow("")
    .messages({
      "string.base": "media_ids must be a string",
      "string.pattern.base":
        "media_ids must be comma-separated positive integers",
    }),
  attnds_id: Joi.string()
    .pattern(/^\d+(,\d+)*$/) // only digits separated by commas
    .required()
    .messages({
      "string.base": "attnds_id must be a string",
      "string.empty": "attnds_id cannot be empty",
      "string.pattern.base":
        "attnds_id must be comma-separated positive integers",
      "any.required": "attnds_id is required",
    }),

  from_date: Joi.string().required().messages({
    "string.required": "meeting_date must be required",
  }),
  to_date: Joi.string().required().messages({
    "string.required": "meeting_date must be required",
  }),
  is_remind: Joi.number().valid(0, 1, 2).required().messages({
    "any.required": "Reminder must be required",
    "any.only": "0, 1, 2 only allowed to be enter",
    "number.base": "is_remind must be a number",
  }),
  remind_tenure: Joi.string().allow("").optional().messages({
    "number.required": "Reminder must be required",
    "number.base": "remind_tenure must be a number",
  }),
  snooze_at: Joi.string().allow("").optional().messages({
    "number.required": "snooze_at must be required",
    "number.base": "snooze_at must be a number",
  }),
});

export const deleteMeetingSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id should be an Integer",
    "any.required": "Id cannot be empty",
  }),
});

export const updateMeetingSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id should be a string",
    "any.required": "Id cannot be empty",
  }),
  title: Joi.string().max(30).optional().messages({
    "string.string": "title should be a given in string",
    "string.max": "title should be atleast maximum 30 chars",
  }),
  descp: Joi.string().max(250).optional().messages({
    "string.string": "description should be a given in string",
    "string.max": "description should be atleast maximum 250 chars",
  }),
  m_type: Joi.number().valid(0, 1).optional().messages({
    "number.only": "0 and 1 only allowed",
    "number.base": "meeting type should be a number",
  }),
  m_priority: Joi.number().valid(0, 1, 2).optional().messages({
    "number.only": "0, 1, 2 only allowed",
    "number.base": "meeting priority should be a number",
  }),
  m_link: Joi.string().optional().allow("").messages({
    "string.string": "meeeting link should be a string",
  }),
  notes: Joi.string().max(150).allow("").optional().messages({
    "string.string": "meeeting link should be a string",
    "string.max": "meeeting link should be a under or exactly 150 chars",
  }),
  address: Joi.string().allow("").optional().messages({
    "string.string": "meeeting link should be a string",
  }),
  lat: Joi.string()
    .pattern(/^(-?[0-9]{1,2})(\.[0-9]{1,6})?$/)
    .allow("")
    .messages({
      "string.pattern.base":
        "Latitude must be a valid decimal value with up to 6 decimal places",
    }),
  lng: Joi.string()
    .pattern(/^(-?[0-9]{1,3})(\.[0-9]{1,6})?$/)
    .allow("")
    .messages({
      "string.pattern.base":
        "Longitude must be a valid decimal value with up to 6 decimal places",
    }),
  status: Joi.string()
    .valid("pending", "completed", "upcoming", "cancelled")
    .optional()
    .allow("")
    .messages({
      "string.base": "status must be a string",
      "any.only": "status must be one of: pending, completed, upcoming",
    }),
  media_id: Joi.string()
    .pattern(/^\d+(,\d+)*$/) // only digits separated by commas
    .allow("")
    .optional()
    .messages({
      "string.base": "media_ids must be a string",
      "string.pattern.base":
        "media_ids must be comma-separated positive integers",
    }),
  attnds_id: Joi.string()
    .pattern(/^\d+(,\d+)*$/) // only digits separated by commas
    .optional()
    .messages({
      "string.base": "attnds_id must be a string",
      "string.empty": "attnds_id cannot be empty",
      "string.pattern.base":
        "attnds_id must be comma-separated positive integers",
    }),

  from_date: Joi.string().optional().messages({
    "string.required": "meeting_date must be required",
  }),
  to_date: Joi.string().optional().messages({
    "string.required": "meeting_date must be required",
  }),
  is_remind: Joi.number().valid(0, 1, 2).optional().messages({
    "number.valid": "0, 1, 2 only allowed to be enter",
    "number.base": "is_remind must be a number",
  }),
  remind_tenure: Joi.number().optional().allow("").messages({
    "number.base": "is_remind must be a number",
  }),
  snooze_at: Joi.number().optional().allow("").messages({
    "number.base": "snooze at must be a number",
  }),
});
export const getMeetingSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.string": "user Id should be a string",
    "string.required": "user Id cannot be empty",
  }),
  status: Joi.string()
    .valid("upcoming", "completed", "cancelled", "pending")
    .allow("")
    .messages({
      "string.string": "status should be a string",
      "any.only":
        "status must be one of: upcoming, completed, cancelled, pending, or an empty string",
    }),
  from_date: Joi.string().allow("").messages({
    "string.string": "from_date should be a string",
    "any.required": "from_date cannot be empty",
  }),
  to_date: Joi.string().allow("").messages({
    "string.string": "to_date should be a string",
    "any.required": "to_date cannot be empty",
  }),
});

export const addMediaSchema = Joi.object({
  org_name: Joi.string().required().messages({
    "string.string": "original name should be a string",
    "string.required": "original name cannot be empty",
  }),
});

export const userIdSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.string": "user Id should be a string",
    "string.required": "user Id cannot be empty",
  }),
});

export const reminderSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id should be a string",
    "any.required": "Id cannot be empty",
  }),
  is_remind: Joi.number().optional().valid(1, 2).messages({
    "number.base": "is_remind should be an number",
  }),
  snooze_at: Joi.number().optional().messages({
    "number.base": "is_remind must be a number",
  }),
  curr_snooze_at: Joi.string().optional().messages({
    "string.string": "curretn snooze_at must be string",
  }),
});

export const addAppointSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "user Id should be a string",
    "any.required": "user Id cannot be empty",
  }),
  title: Joi.string().required().messages({
    "string.base": "title must be a string",
    "any.required": "title is required",
  }),
  a_type: Joi.string().required().messages({
    "string.base": "a_type must be a string",
    "any.required": "a_type is required",
  }),
  notes: Joi.string().allow("").messages({
    "string.base": "notes must be a string",
  }),
  address: Joi.string().allow("").required().messages({
    "string.base": "address must be a string",
    "any.required": "address is required",
  }),
  lat: Joi.number().allow("").required().messages({
    "string.base": "lat must be a string",
    "any.required": "lat is required",
  }),
  lng: Joi.number().allow("").required().messages({
    "string.base": "lng must be a number",
    "any.required": "lng is required",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media_id must be a string",
  }),
  con_name: Joi.string().required().messages({
    "string.base": "con_name must be a string",
    "any.required": "con_name is required",
  }),
  con_desg: Joi.string().allow("").required().messages({
    "string.base": "con_desg must be a string",
    "any.required": "con_desg is required",
  }),
  from_date: Joi.string().required().messages({
    "string.base": "from_date must be a string",
    "any.required": "from_date is required",
  }),
  to_date: Joi.string().required().messages({
    "string.base": "to_date must be a string",
    "any.required": "to_date is required",
  }),
  is_remind: Joi.number().required().messages({
    "string.base": "is_remind must be a integer",
    "any.required": "is_remind is required",
  }),
  remind_tenure: Joi.string().allow("").messages({
    "string.base": "remind_tenure must be a integer",
  }),
  snooze_at: Joi.string().allow("").messages({
    "string.base": "snooze_at must be a integer",
  }),
});

export const deleteAppointSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id should be an Integer",
    "any.required": "Id cannot be empty",
  }),
});

export const getAppointSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "user Id should be a string",
    "any.required": "user Id cannot be empty",
  }),
  status: Joi.string().messages({
    "string.base": "status should be a string",
  }),
});

export const updateAppointSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id should be a string",
    "any.required": "Id cannot be empty",
  }),
  title: Joi.string().required().messages({
    "string.base": "title should be a string",
    "any.required": "title cannot be empty",
  }),
  a_type: Joi.string().required().messages({
    "string.base": "a_type should be a string",
    "any.required": "title cannot be empty",
  }),
  notes: Joi.string().allow("").messages({
    "string.base": "notes should be a string",
  }),
  address: Joi.string().allow("").messages({
    "string.base": "address should be a string",
  }),
  lat: Joi.string().allow("").messages({
    "string.base": "lat should be a number",
  }),
  lng: Joi.string().allow("").messages({
    "string.base": "lng should be a number",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media_id should be a string",
  }),
  con_name: Joi.string().required().messages({
    "string.base": "con_name should be a string",
    "any.required": "con_name cannot be empty",
  }),
  con_desg: Joi.string().allow("").messages({
    "string.base": "con_desg should be a string",
  }),
  from_date: Joi.string().required().messages({
    "string.base": "from_date must be a string",
    "any.required": "from_date cannot be empty",
  }),
  to_date: Joi.string().required().messages({
    "string.base": "to_date must be a string",
    "any.required": "to_date cannot be empty",
  }),
  is_remind: Joi.number().messages({
    "number.base": "is_remind must be a integer",
    "any.required": "is_remind cannot be empty",
  }),
  remind_tenure: Joi.string().required().allow("").messages({
    "string.base": "remind_tenure must be a integer",
    "any.required": "remind_tenure cannot be empty",
  }),
  snooze_at: Joi.string().required().allow("").messages({
    "string.base": "snooze_at must be a integer",
    "any.required": "snooze_at cannot be empty",
  }),
});

export const addTravelSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  title: Joi.string().required().messages({
    "string.base": "title should be a string",
    "any.required": "title cannot be empty",
  }),
  descp: Joi.string().required().messages({
    "string.base": "description should be a string",
    "any.required": "description cannot be empty",
  }),
  purpose: Joi.number().valid(0, 1).messages({
    "number.base": "title should be a string",
  }),
  travel_from: Joi.string().required().messages({
    "string.base": "travel from should be a string",
    "any.required": "travel from cannot be empty",
  }),
  from_lat: Joi.string().required().messages({
    "string.base": "lat should be a number",
    "any.required": "travel from cannot be empty",
  }),
  from_lng: Joi.string().required().messages({
    "string.base": "lng should be a number",
    "any.required": "travel from cannot be empty",
  }),
  travel_to: Joi.string().required().messages({
    "string.base": "travel to should be a string",
    "any.required": "travel to cannot be empty",
  }),
  to_lat: Joi.string().required().messages({
    "string.base": "lat should be a number",
    "any.required": "travel from cannot be empty",
  }),
  to_lng: Joi.string().required().messages({
    "string.base": "lng should be a number",
    "any.required": "travel from cannot be empty",
  }),
  from_date: Joi.string().required().messages({
    "string.base": "from_date to should be a string",
    "any.required": "from_date to cannot be empty",
  }),
  to_date: Joi.string().required().messages({
    "string.base": "to_date to should be a string",
    "any.required": "to_date to cannot be empty",
  }),
  vech_mode: Joi.string().required().messages({
    "string.base": "vech_mode to should be a string",
    "any.required": "vech_mode to cannot be empty",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media_id to should be a string",
  }),
  in_hotel: Joi.number().valid(0, 1).required().messages({
    "number.base": "in_hotel to should be a number",
    "any.required": "in_hotel to cannot be empty",
  }),
  hot_name: Joi.string().allow("").messages({
    "string.base": "hot_name to should be a string",
  }),
  hot_address: Joi.string().allow("").messages({
    "string.base": "hot_address to should be a string",
  }),
  hot_lat: Joi.string().allow("").messages({
    "string.base": "hot_lat should be a number",
  }),
  hot_lng: Joi.string().allow("").messages({
    "string.base": "hot_lng should be a number",
  }),
  hot_in: Joi.string().allow("").messages({
    "string.base": "hot_in to should be a string",
  }),
  hot_out: Joi.string().allow("").messages({
    "string.base": "hot_out to should be a string",
  }),
  hot_media: Joi.string().allow("").messages({
    "string.base": "hot_media to should be a string",
  }),
  is_remind: Joi.number().required().messages({
    "string.base": "is_remind to should be a string",
    "any.required": "is_remind to cannot be empty",
  }),
  remind_tenure: Joi.string().allow("").messages({
    "string.base": "remind_tenure to should be a string",
  }),
  snooze_at: Joi.string().allow("").messages({
    "string.base": "snooze_at to should be a string",
  }),
});

export const deleteTravelSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});

export const updateTravelSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id to cannot be empty",
  }),
  title: Joi.string().required().messages({
    "string.base": "title should be a string",
    "any.required": "title to cannot be empty",
  }),
  descp: Joi.string().required().messages({
    "string.base": "description should be a string",
    "any.required": "description to cannot be empty",
  }),
  purpose: Joi.number().required().valid(0, 1).messages({
    "number.base": "title should be a string",
    "any.required": "purpose to cannot be empty",
  }),
  travel_from: Joi.string().required().messages({
    "string.base": "travel from should be a string",
    "any.required": "travel from to cannot be empty",
  }),
  from_lat: Joi.string().required().messages({
    "string.base": "from lat should be a number",
    "any.required": "from lat from cannot be empty",
  }),
  from_lng: Joi.string().required().messages({
    "string.base": "from lng should be a number",
    "any.required": "from lng cannot be empty",
  }),
  travel_to: Joi.string().required().messages({
    "string.base": "travel to should be a string",
    "any.required": "travel to to cannot be empty",
  }),
  to_lat: Joi.string().required().messages({
    "string.base": "to lat should be a number",
    "any.required": "to lat cannot be empty",
  }),
  to_lng: Joi.string().required().messages({
    "string.base": "to lng should be a number",
    "any.required": "to lng from cannot be empty",
  }),
  from_date: Joi.string().required().messages({
    "string.base": "from date should be a string",
    "any.required": "from date cannot be empty",
  }),
  to_date: Joi.string().required().messages({
    "string.base": "to_date should be a string",
    "any.required": "to date cannot be empty",
  }),
  vech_mode: Joi.string().required().messages({
    "string.base": "vech_mode should be a string",
    "any.required": "vech mode cannot be empty",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media_id to should be a string",
  }),
  in_hotel: Joi.number().allow("").messages({
    "number.base": "in_hotel to should be a string",
  }),
  hot_name: Joi.string().allow("").messages({
    "string.base": "hot_name to should be a string",
  }),
  hot_address: Joi.string().allow("").messages({
    "string.base": "hot_address to should be a string",
  }),
  hot_lat: Joi.string().required().allow("").messages({
    "string.base": "hot lat should be a number",
    "any.required": "hot lat cannot be empty",
  }),
  hot_lng: Joi.string().required().allow("").messages({
    "string.base": "hot lng should be a number",
    "any.required": "hot lng from cannot be empty",
  }),
  hot_in: Joi.string().allow("").messages({
    "string.base": "hot_in to should be a string",
  }),
  hot_out: Joi.string().allow("").messages({
    "string.base": "hot_out to should be a string",
  }),
  hot_media: Joi.string().allow("").messages({
    "string.base": "hot_media to should be a string",
  }),
  is_remind: Joi.number().required().messages({
    "string.base": "is_remind to should be a string",
  }),
  remind_tenure: Joi.string().allow("").messages({
    "string.base": "remind_tenure to should be a string",
  }),
  snooze_at: Joi.string().allow("").messages({
    "string.base": "snooze_at to should be a string",
  }),
});

export const getTravelSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  id: Joi.number().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});

export const adddailyplanSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
  from: Joi.string().required().messages({
    "string.base": "from should be a string",
    "any.required": "from cannot be empty",
  }),
  to: Joi.string().required().messages({
    "string.base": "To should be a string",
    "any.required": "To cannot be empty",
  }),
  departure: Joi.string().required().messages({
    "string.base": "departure should be a string",
    "any.required": "departure cannot be empty",
  }),
  vech_mode: Joi.string().required().messages({
    "string.base": "vech_mode should be a string",
    "any.required": "vech_mode cannot be empty",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media_id should be a string",
  }),
});

export const updatedailyplanSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Daily plan Id should be an integer",
    "any.required": "Daily plan cannot be empty",
  }),
  from: Joi.string().required().messages({
    "string.base": "from should be a string",
    "any.required": "from cannot be empty",
  }),
  to: Joi.string().required().messages({
    "string.base": "To should be a string",
    "any.required": "To cannot be empty",
  }),
  departure: Joi.string().required().messages({
    "string.base": "departure should be a string",
    "any.required": "departure cannot be empty",
  }),
  vech_mode: Joi.string().required().messages({
    "string.base": "vech mode should be a string",
    "any.required": "vech mode cannot be empty",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media_id should be a string",
  }),
});

export const deleteDailyplanSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});

export const addExpenseSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
  category: Joi.string().required().messages({
    "string.base": "category should be a string",
    "any.required": "category cannot be empty",
  }),
  notes: Joi.string().allow("").messages({
    "string.base": "notes should be a string",
  }),
  exp_date: Joi.string().required().messages({
    "number.base": "exp_date should be a integer",
    "any.required": "exp_date cannot be empty",
  }),
  amount: Joi.string().required().messages({
    "number.base": "amount should be a string",
    "any.required": "amount cannot be empty",
  }),
  // amount: Joi.number().precision(2).positive().required().messages({
  //   "string.base": "Amount should be an integer",
  //   "number.precision": "Amount must have up to 2 decimal places",
  //   "number.positive": "Amount must be greater than zero",
  //   "any.required": "Amount cannot be empty",
  // }),
});
export const deleteExpenseSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id should be an integer",
    "any.required": "Id cannot be empty",
  }),
});
export const updateExpenseSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id should be an integer",
    "any.required": "Id cannot be empty",
  }),
  category: Joi.string().required().messages({
    "string.base": "category should be a string",
    "any.required": "category cannot be empty",
  }),
  notes: Joi.string().allow("").messages({
    "string.base": "notes should be a string",
  }),
  exp_date: Joi.string().required().messages({
    "number.base": "exp_date should be a integer",
    "any.required": "exp_date cannot be empty",
  }),
  amount: Joi.string().required().messages({
    "number.base": "amount should be a string",
    "any.required": "amount cannot be empty",
  }),
});
export const getExpenseSchema = Joi.object({
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});

export const addNotesSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
  title: Joi.string().max(100).required().messages({
    "string.base": "Title should be a string",
    "string.max": "Title cannot be more than 100 chars",
    "any.required": "Title cannot be empty",
  }),
  descp: Joi.string().max(150).allow("").messages({
    "string.base": "descp should be a string",
    "string.max": "descp cannot be more than 100 chars",
    "any.required": "descp cannot be empty",
  }),
});
export const getNotesSchema = Joi.object({
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});
export const updateNotesSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
  title: Joi.string().max(100).messages({
    "string.base": "Title should be a string",
    "string.max": "Title cannot be more than 100 chars",
    "any.required": "Title cannot be empty",
  }),
  descp: Joi.string().max(150).allow("").messages({
    "string.base": "descp should be a string",
    "string.max": "descp cannot be more than 100 chars",
    "any.required": "descp cannot be empty",
  }),
});

export const deleteNotesSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});
export const addTravelPhotosSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
  media_id: Joi.string().required().messages({
    "string.base": "Media Id should be a string",
    "any.required": "Media Id cannot be empty",
  }),
});
export const updateTravelPhotosSchema = Joi.object({
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
  media_id: Joi.string().required().messages({
    "string.base": "Media Id should be a string",
    "any.required": "Media Id cannot be empty",
  }),
});
export const deleteTravelPhotosSchema = Joi.object({
  media_id: Joi.string().required().messages({
    "string.base": "media Id should be an string",
    "any.required": "media Id cannot be empty",
  }),
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});
export const getTravelPhotosSchema = Joi.object({
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});
export const getCountriesSchema = Joi.object({
  country: Joi.string().allow("").messages({
    "string.base": "country should be an string",
  }),
  state: Joi.string().allow("").messages({
    "string.base": "state should be an string",
  }),
});

export const addTaskSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "user id should be an string",
    "any.required": "user id cannot be empty",
  }),
  title: Joi.string().required().messages({
    "string.base": "title should be an string",
    "any.required": "title cannot be empty",
  }),
  descp: Joi.string().required().messages({
    "string.base": "descp should be an string",
    "any.required": "descp cannot be empty",
  }),
  t_priority: Joi.number().valid(0, 1, 2).required().messages({
    "number.base": "task priority should be an number",
    "number.valid": "either 0 or 1 or 2 only",
    "any.required": "task priority cannot be empty",
  }),
  from_date: Joi.string().required().messages({
    "string.base": "from_date should be an string",
    "any.required": "from_date cannot be empty",
  }),
  to_date: Joi.string().required().messages({
    "string.base": "to_date should be an string",
    "any.required": "to_date cannot be empty",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media_id should be an string",
  }),
  attnds_id: Joi.string().required().messages({
    "string.base": "attnds should be an string",
    "any.required": "attnds cannot be empty",
  }),
  is_remind: Joi.number().valid(0, 1, 2).required().messages({
    "number.base": "is_remind should be an string",
    "number.valid": "either 0 or 1 or 2 only",
    "any.required": "is_remind cannot be empty",
  }),
  remind_tenure: Joi.string().allow("").messages({
    "string.base": "remind_tenure should be an string",
  }),
  snooze_at: Joi.string().allow("").messages({
    "string.base": "snooze at should be an string",
  }),
});
export const deleteTaskSchema = Joi.object({
  id: Joi.number().required().messages({
    "string.base": "task id should be an number",
    "any.required": "task id cannot be empty",
  }),
});
export const updateTaskSchema = Joi.object({
  id: Joi.number().required().messages({
    "string.base": "task id should be an number",
    "any.required": "task id cannot be empty",
  }),
  title: Joi.string().required().messages({
    "string.base": "title should be an string",
    "any.required": "title cannot be empty",
  }),
  descp: Joi.string().required().messages({
    "string.base": "descp should be an string",
    "any.required": "descp cannot be empty",
  }),
  t_priority: Joi.number().valid(0, 1, 2).required().messages({
    "number.base": "task priority should be an number",
    "number.valid": "either 0 or 1 or 2 only",
    "any.required": "task priority cannot be empty",
  }),
  from_date: Joi.string().required().messages({
    "string.base": "from_date should be an string",
    "any.required": "from_date cannot be empty",
  }),
  to_date: Joi.string().required().messages({
    "string.base": "to_date should be an string",
    "any.required": "to_date cannot be empty",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media_id should be an string",
  }),
  attnds_id: Joi.string().required().messages({
    "string.base": "attnds should be an string",
    "any.required": "attnds cannot be empty",
  }),
  is_remind: Joi.number().valid(0, 1, 2).required().messages({
    "number.base": "is_remind should be an string",
    "number.valid": "either 0 or 1 or 2 only",
    "any.required": "is_remind cannot be empty",
  }),
  remind_tenure: Joi.string().allow("").messages({
    "string.base": "remind_tenure should be an string",
  }),
  snooze_at: Joi.string().allow("").messages({
    "string.base": "snooze at should be an string",
  }),
});
export const getTaskSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "user id should be a string",
    "any.required": "task id cannot be empty",
  }),
  status: Joi.string()
    .valid("pending", "inprogress", "completed", "cancelled")
    .allow("")
    .messages({
      "string.base": "status should be a string",
      "any.only": "status must be pending, upcoming, completed, or cancelled",
    }),
});

// 

export const financeSchema = Joi.object({
  id: Joi.number().optional(),
  user_id: Joi.string().required().messages({
    "any.required": "User Id is required",
  }),
  type: Joi.string().required().messages({
    "any.required": "Type is required",
  }),

  cat_id: Joi.string().optional(),

  cat_name: Joi.string().optional(),

  trans_date: Joi.string().required().messages({
    "any.required": "Transaction Date is required",
  }),

  amount: Joi.number().required().messages({
    "number.base": "Amount must be a number",
    "any.required": "Amount is required",
  }),

  notes: Joi.string().allow("").optional(),
  attachment: Joi.string().allow("").optional(),
});

// finance category
export const finCategorySchema = Joi.object({
  id: Joi.number().optional(),

  cat_name: Joi.string().required().messages({
    "any.required": "Category Name is required",
  }),

  cat_type: Joi.string().valid("income", "expense").required().messages({
    "any.required": "Category Type  is required",
    "any.only": "Type must be either Income or expense",
  }),
  cat_img: Joi.number().required().messages({
    "any.required": "Category Image is required",
  }),
  status: Joi.string().valid("active", "inactive").required().messages({
    "any.required": "Status is required",
    "any.only": "Type must be either active or inactive",
  }),
});
export const statusChangeSchema = Joi.object({
  id: Joi.number().required().messages({
    "string.base": "id should be a number",
    "any.required": "id cannot be empty",
  }),
  status: Joi.string().valid("completed", "cancelled").required().messages({
    "string.base": "id should be a number",
    "any.only": "status should be either completed or cancelled",
    "any.required": "id cannot be empty",
  }),
  type: Joi.string().required().messages({
    "string.base": "type should be a number",
    "any.required": "type cannot be empty",
  }),
});
export const addIssueCategorySchema = Joi.object({
  category: Joi.string().required().messages({
    "string.base": "category should be a string",
    "any.required": "category cannot be empty",
  }),
});
export const addIssueSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "user id should be a string",
    "any.required": "user id cannot be empty",
  }),
  cat_id: Joi.number().required().messages({
    "string.base": "category id should be a number",
    "any.required": "category id cannot be empty",
  }),
  cat_name: Joi.string().allow("").messages({
    "string.base": "category name should be a number",
    "any.required": "category name cannot be empty",
  }),
  descp: Joi.string().required().messages({
    "string.base": "description should be a string",
    "any.required": "description cannot be empty",
  }),
  address: Joi.string().required().messages({
    "string.base": "address should be a string",
    "any.required": "address cannot be empty",
  }),
  lat: Joi.string().required().messages({
    "string.base": "lat must be a string",
    "any.required": "lat is required",
  }),
  lng: Joi.string().required().messages({
    "string.base": "lng must be a string",
    "any.required": "lng is required",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media id must be a string",
    "any.required": "media id is required",
  }),
  report_date: Joi.string().required().messages({
    "string.base": "report date must be a string",
    "any.required": "report date is required",
  }),
  incharge_id: Joi.string().allow("").messages({
    "string.base": "incharge id must be a string",
    "any.required": "incharge id is required",
  }),
  member_id: Joi.string().allow("").messages({
    "string.base": "member id must be a string",
    "any.required": "member id is required",
  }),
});
export const deleteIssueSchema = Joi.object({
  id: Joi.number().required().messages({
    "string.base": "number should be a number",
    "any.required": "number cannot be empty",
  }),
});
export const updateIssueschema = Joi.object({
  id: Joi.number().required().messages({
    "string.base": "Issue id should be a number",
    "any.required": "Issue id cannot be empty",
  }),
  cat_id: Joi.number().required().messages({
    "string.base": "category id should be a number",
    "any.required": "category id cannot be empty",
  }),
  cat_name: Joi.string().allow("").messages({
    "string.base": "category name should be a number",
    "any.required": "category name cannot be empty",
  }),
  descp: Joi.string().required().messages({
    "string.base": "description should be a string",
    "any.required": "description cannot be empty",
  }),
  address: Joi.string().required().messages({
    "string.base": "address should be a string",
    "any.required": "address cannot be empty",
  }),
  lat: Joi.string().required().messages({
    "string.base": "lat must be a string",
    "any.required": "lat is required",
  }),
  lng: Joi.string().required().messages({
    "string.base": "lng must be a string",
    "any.required": "lng is required",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media id must be a string",
    "any.required": "media id is required",
  }),
  report_date: Joi.string().required().messages({
    "string.base": "report date must be a string",
    "any.required": "report date is required",
  }),
  incharge_id: Joi.string().allow("").messages({
    "string.base": "incharge id must be a string",
    "any.required": "incharge id is required",
  }),
  member_id: Joi.string().allow("").messages({
    "string.base": "member id must be a string",
    "any.required": "member id is required",
  }),
});
export const getIssueSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User id should be a string",
    "any.required": "User id cannot be empty",
  }),
  status: Joi.string()
    .valid("pending", "inprogress", "completed")
    .allow("")
    .messages({
      "string.base": "status should be a string",
    }),
  assigned: Joi.number().valid(0, 1).allow("").messages({
    "string.base": "assigned should be a number",
  }),
  from_date: Joi.string().allow("").messages({
    "string.base": "from_date should be a string",
  }),
  to_date: Joi.string().allow("").messages({
    "string.base": "to_date should be a string",
  }),
});

export const addSumitCategorySchema = Joi.object({
  category: Joi.string().required().messages({
    "string.base": "category should be a string",
    "any.required": "category cannot be empty",
  }),
});

const politicalDeptMemberSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "VIP name should be string",
    "any.required": "VIP name is required",
  }),
  cat_id: Joi.number().required().messages({
    "number.base": "category id should be string",
    "any.required": "category id is required",
  }),
  cat_name: Joi.string().allow("").messages({
    "string.base": "category name should be string",
    "any.required": "category name is required",
  }),
  dept_id: Joi.number().required().messages({
    "number.base": "department id should be string",
    "any.required": "department id is required",
  }),
  dept_name: Joi.string().allow("").messages({
    "string.base": "department name should be string",
    "any.required": "department name is required",
  }),
});
const politicalMemberSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "VIP name should be string",
    "any.required": "VIP name is required",
  }),
  cat_id: Joi.number().required().messages({
    "number.base": "category id should be string",
    "any.required": "category id is required",
  }),
  cat_name: Joi.string().allow("").messages({
    "string.base": "category name should be string",
    "any.required": "category name is required",
  }),
});
export const addSumitSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User id should be a string",
    "any.required": "User id cannot be empty",
  }),
  title: Joi.string().required().messages({
    "string.base": "Title should be a string",
    "any.required": "Title cannot be empty",
  }),
  location: Joi.string().required().messages({
    "string.base": "location should be a string",
    "any.required": "location cannot be empty",
  }),
  lat: Joi.string().required().messages({
    "string.base": "lat should be a string",
    "any.required": "lat cannot be empty",
  }),
  lng: Joi.string().required().messages({
    "string.base": "lng should be a string",
    "any.required": "lng cannot be empty",
  }),
  sumit_date: Joi.string().required().messages({
    "string.base": "sumit date should be a string",
    "any.required": "sumit date cannot be empty",
  }),
  vip: Joi.array().items(politicalMemberSchema).required().messages({
    "array.base": "vip should be a array",
    "any.required": "vip cannot be empty",
  }),
  member: Joi.array().items(politicalMemberSchema).required().messages({
    "array.base": "member should be a array",
    "any.required": "member cannot be empty",
  }),
  sumit_incharge: Joi.array().items(politicalMemberSchema).required().messages({
    "array.base": "sumit_incharge should be an array",
    "any.required": "sumit_incharge cannot be empty",
  }),
  dept_incharge: Joi.array()
    .items(politicalDeptMemberSchema)
    .required()
    .messages({
      "array.base": "dept_incharge should be an array",
      "any.required": "dept_incharge cannot be empty",
    }),
});
export const deleteSumitSchema = Joi.object({
  id: Joi.number().required().messages({
    "string.base": "sumit id should be a number",
    "any.required": "sumit id is required",
  }),
});
export const getSumitSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User id should be a string",
    "any.required": "User id cannot be empty",
  }),
  status: Joi.string()
    .valid("upcoming", "completed", "cancelled", "inprogress")
    .allow("")
    .messages({
      "string.base": "status should be a string",
      "any.only":
        "status must be one of: pending, completed, cancelled, inprogress",
    }),
  from_date: Joi.string().allow("").messages({
    "string.base": "from date should be a string",
  }),
  to_date: Joi.string().allow("").messages({
    "string.base": "from date should be a string",
  }),
  id: Joi.string().allow("").messages({
    "number.base": "sumit id should be a number",
  }),
});
export const updateSumitSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "sumit id should be a string",
    "any.required": "sumit id cannot be empty",
  }),
  title: Joi.string().required().messages({
    "string.base": "Title should be a string",
    "any.required": "Title cannot be empty",
  }),
  location: Joi.string().required().messages({
    "string.base": "location should be a string",
    "any.required": "location cannot be empty",
  }),
  lat: Joi.string().required().messages({
    "string.base": "lat should be a string",
    "any.required": "lat cannot be empty",
  }),
  lng: Joi.string().required().messages({
    "string.base": "lng should be a string",
    "any.required": "lng cannot be empty",
  }),
  sumit_date: Joi.string().required().messages({
    "string.base": "sumit date should be a string",
    "any.required": "sumit date cannot be empty",
  }),
  del_people: Joi.array()
    .items(
      Joi.string().messages({
        "string.base": "array items should be a string",
      }),
    )
    .required()
    .messages({
      "array.base": "delete people id's date should be an array",
    }),
  vip: Joi.array().items(politicalMemberSchema).required().messages({
    "array.base": "vip should be a array",
    "any.required": "vip cannot be empty",
  }),
  member: Joi.array().items(politicalMemberSchema).required().messages({
    "array.base": "member should be a array",
    "any.required": "member cannot be empty",
  }),
  sumit_incharge: Joi.array().items(politicalMemberSchema).required().messages({
    "array.base": "sumit_incharge should be an array",
    "any.required": "sumit_incharge cannot be empty",
  }),
  dept_incharge: Joi.array()
    .items(politicalDeptMemberSchema)
    .required()
    .messages({
      "array.base": "dept_incharge should be an array",
      "any.required": "dept_incharge cannot be empty",
    }),
});
