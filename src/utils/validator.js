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
    .messages({
      "any.required": "Mobile number is required",
      "string.empty": "Mobile number is required",
      "string.min": "Mobile number must be at least 10 digits",
      "string.max": "Mobile number must not exceed 15 digits",
      "string.pattern.base": "Mobile number must start with 6-9",
    }),
  email: Joi.string().min(13).max(100).messages({
    "any.required": "Email is required",
    "string.empty": "Email is required",
    "string.min": "Email must be at least 3 chars",
    "string.max": "Email must not exceed 100 chars",
  }),
  c_code: Joi.string()
    .pattern(/^\+\d{2,3}$/)
    .optional(),
  otp: Joi.string().length(4).pattern(/^\d+$/).required().messages({
    "string.length": "OTP must be exactly 4 digits",
    "string.pattern": "OTP must contain only numbers",
    "any.required": "OTP is required",
  }),
})
  .or("phn_num", "email")
  .messages({
    "object.missing": "Either mobile or email is required",
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
    "number.base": "id must be an integer",
    "any.required": "id is required",
    "any.empty": "id should not be empty",
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

export const deleteMemberSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "id must be an integer",
    "any.required": "id is required",
    "any.empty": "id should not be empty",
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
  m_link: Joi.string().optional().messages({
    "string.string": "meeeting link should be a string",
  }),
  notes: Joi.string().max(150).allow("").optional().messages({
    "string.string": "meeeting link should be a string",
    "string.max": "meeeting link should be a under or exactly 150 chars",
  }),
  address: Joi.string().allow("").optional().messages({
    "string.string": "meeeting link should be a string",
  }),
  lat: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-90) // ✅ valid latitude range
    .max(90)
    .allow("")
    .optional()
    .messages({
      "number.base": "Latitude must be a number",
      "number.precision": "Latitude must have up to 6 decimal places",
      "number.min": "Latitude cannot be less than -90",
      "number.max": "Latitude cannot be greater than 90",
    }),
  lng: Joi.number()
    .precision(6)
    .min(-180)
    .max(180)
    .allow("")
    .optional()
    .messages({
      "number.base": "Longitude must be a number",
      "number.precision": "Longitude must have up to 6 decimal places",
      "number.min": "Longitude cannot be less than -180",
      "number.max": "Longitude cannot be greater than 180",
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
  remind_tenure: Joi.number().optional().messages({
    "number.base": "is_remind must be a number",
  }),
  snooze_at: Joi.number().optional().messages({
    "number.base": "snooze at must be a number",
  }),
});

export const addMediaSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.string": "user Id should be a string",
    "string.required": "user Id cannot be empty",
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
  notes: Joi.string().messages({
    "string.base": "notes must be a string",
  }),
  address: Joi.string().required().messages({
    "string.base": "address must be a string",
    "any.required": "address is required",
  }),
  lat: Joi.number().required().messages({
    "string.base": "lat must be a string",
    "any.required": "lat is required",
  }),
  lng: Joi.number().required().messages({
    "string.base": "lng must be a number",
    "any.required": "lng is required",
  }),
  media_id: Joi.string().messages({
    "string.base": "media_id must be a string",
  }),
  con_name: Joi.string().required().messages({
    "string.base": "con_name must be a string",
    "any.required": "con_name is required",
  }),
  con_desg: Joi.string().required().messages({
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
  remind_tenure: Joi.number().messages({
    "string.base": "remind_tenure must be a integer",
  }),
  snooze_at: Joi.number().messages({
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
  title: Joi.string().messages({
    "string.base": "title should be a string",
  }),
  a_type: Joi.string().messages({
    "string.base": "a_type should be a string",
  }),
  notes: Joi.string().allow("").messages({
    "string.base": "notes should be a string",
  }),
  address: Joi.string().allow("").messages({
    "string.base": "address should be a string",
  }),
  lat: Joi.number().allow("").messages({
    "number.base": "lat should be a number",
  }),
  lng: Joi.number().allow("").messages({
    "number.base": "lng should be a number",
  }),
  media_id: Joi.string().allow("").messages({
    "string.base": "media_id should be a string",
  }),
  con_name: Joi.string().messages({
    "string.base": "con_name should be a string",
  }),
  con_desg: Joi.string().messages({
    "string.base": "con_desg should be a string",
  }),
  status: Joi.string().messages({
    "string.base": "status should be a string",
  }),
  from_date: Joi.string().messages({
    "string.base": "from_date must be a string",
  }),
  to_date: Joi.string().messages({
    "string.base": "to_date must be a string",
  }),
  is_remind: Joi.number().messages({
    "number.base": "is_remind must be a integer",
  }),
  remind_tenure: Joi.number().messages({
    "number.base": "remind_tenure must be a integer",
  }),
  snooze_at: Joi.number().messages({
    "number.base": "snooze_at must be a integer",
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
  from_lat: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-90) // ✅ valid latitude range
    .max(90)
    .required()
    .messages({
      "string.base": "from_lat should be a string",
      "any.required": "from_lat cannot be empty",
    }),
  from_lng: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-180) // ✅ valid latitude range
    .max(180)
    .required()
    .messages({
      "string.base": "from_lat should be a string",
      "any.required": "from_lat cannot be empty",
    }),
  travel_to: Joi.string().required().messages({
    "string.base": "travel to should be a string",
    "any.required": "travel to cannot be empty",
  }),
  to_lat: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-90) // ✅ valid latitude range
    .max(90)
    .required()
    .messages({
      "string.base": "to_lat should be a string",
      "any.required": "to_lat cannot be empty",
    }),
  to_lng: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-180) // ✅ valid latitude range
    .max(180)
    .required()
    .messages({
      "string.base": "to_lat should be a string",
      "any.required": "to_lat cannot be empty",
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
  media_id: Joi.string().messages({
    "string.base": "media_id to should be a string",
  }),
  in_hotel: Joi.number().required().messages({
    "number.base": "in_hotel to should be a string",
    "any.required": "in_hotel to cannot be empty",
  }),
  hot_name: Joi.string().messages({
    "string.base": "hot_name to should be a string",
  }),
  hot_address: Joi.string().messages({
    "string.base": "hot_address to should be a string",
  }),
  hot_lat: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-90) // ✅ valid latitude range
    .max(90)
    .messages({
      "string.base": "hot_lat should be a string",
    }),
  hot_lng: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-180) // ✅ valid latitude range
    .max(180)
    .messages({
      "string.base": "hot_lng should be a string",
    }),
  hot_in: Joi.string().messages({
    "string.base": "hot_in to should be a string",
  }),
  hot_out: Joi.string().messages({
    "string.base": "hot_out to should be a string",
  }),
  hot_media: Joi.string().messages({
    "string.base": "hot_media to should be a string",
  }),
  is_remind: Joi.number().required().messages({
    "string.base": "is_remind to should be a string",
    "any.required": "is_remind to cannot be empty",
  }),
  remind_tenure: Joi.number().messages({
    "string.base": "remind_tenure to should be a string",
  }),
  snooze_at: Joi.number().messages({
    "string.base": "snooze_at to should be a string",
  }),
});

export const deleteTravelSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});

export const updateTravelSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  id: Joi.number().messages({
    "number.base": "Travel Id should be an integer",
  }),
  title: Joi.string().messages({
    "string.base": "title should be a string",
  }),
  descp: Joi.string().messages({
    "string.base": "description should be a string",
  }),
  purpose: Joi.number().valid(0, 1).messages({
    "number.base": "title should be a string",
  }),
  travel_from: Joi.string().messages({
    "string.base": "travel from should be a string",
  }),
  from_lat: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-90) // ✅ valid latitude range
    .max(90)
    .messages({
      "string.base": "from_lat should be a string",
    }),
  from_lng: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-180) // ✅ valid latitude range
    .max(180)
    .messages({
      "string.base": "from_lat should be a string",
    }),
  travel_to: Joi.string().messages({
    "string.base": "travel to should be a string",
  }),
  to_lat: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-90) // ✅ valid latitude range
    .max(90)
    .messages({
      "string.base": "to_lat should be a string",
    }),
  to_lng: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-180) // ✅ valid latitude range
    .max(180)
    .messages({
      "string.base": "to_lat should be a string",
    }),
  from_date: Joi.string().messages({
    "string.base": "from_date to should be a string",
  }),
  to_date: Joi.string().messages({
    "string.base": "to_date to should be a string",
  }),
  vech_mode: Joi.string().messages({
    "string.base": "vech_mode to should be a string",
  }),
  media_id: Joi.string().messages({
    "string.base": "media_id to should be a string",
  }),
  in_hotel: Joi.number().messages({
    "number.base": "in_hotel to should be a string",
  }),
  hot_name: Joi.string().messages({
    "string.base": "hot_name to should be a string",
  }),
  hot_address: Joi.string().messages({
    "string.base": "hot_address to should be a string",
  }),
  hot_lat: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-90) // ✅ valid latitude range
    .max(90)
    .messages({
      "string.base": "hot_lat should be a string",
    }),
  hot_lng: Joi.number()
    .precision(6) // ✅ up to 6 digits after decimal
    .min(-180) // ✅ valid latitude range
    .max(180)
    .messages({
      "string.base": "hot_lng should be a string",
    }),
  hot_in: Joi.string().messages({
    "string.base": "hot_in to should be a string",
  }),
  hot_out: Joi.string().messages({
    "string.base": "hot_out to should be a string",
  }),
  hot_media: Joi.string().messages({
    "string.base": "hot_media to should be a string",
  }),
  is_remind: Joi.number().messages({
    "string.base": "is_remind to should be a string",
  }),
  remind_tenure: Joi.number().messages({
    "string.base": "remind_tenure to should be a string",
  }),
  snooze_at: Joi.number().messages({
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
  departure: Joi.string().messages({
    "string.base": "departure should be a string",
  }),
  vech_mode: Joi.string().required().messages({
    "string.base": "vech_mode should be a string",
    "any.required": "vech_mode cannot be empty",
  }),
  media_id: Joi.string().messages({
    "string.base": "media_id should be a string",
  }),
});

export const updatedailyplanSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
  from: Joi.string().messages({
    "string.base": "from should be a string",
  }),
  to: Joi.string().messages({
    "string.base": "To should be a string",
  }),
  departure: Joi.string().messages({
    "string.base": "departure should be a string",
  }),
  vech_mode: Joi.string().messages({
    "string.base": "vech_mode should be a string",
  }),
  media_id: Joi.string().messages({
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
  notes: Joi.string().messages({
    "string.base": "notes should be a string",
  }),
  exp_date: Joi.number().required().messages({
    "number.base": "exp_date should be a integer",
    "any.required": "exp_date cannot be empty",
  }),
  amount: Joi.number().precision(2).positive().required().messages({
    "string.base": "Amount should be an integer",
    "number.precision": "Amount must have up to 2 decimal places",
    "number.positive": "Amount must be greater than zero",
    "any.required": "Amount cannot be empty",
  }),
});
export const deleteExpenseSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id should be an integer",
    "any.required": "Id cannot be empty",
  }),
  user_id: Joi.string().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  travel_id: Joi.number().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});
export const updateExpenseSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
  category: Joi.string().messages({
    "string.base": "category should be a string",
  }),
  notes: Joi.string().messages({
    "string.base": "notes should be a string",
  }),
  exp_date: Joi.number().messages({
    "number.base": "exp_date should be a integer",
  }),
  amount: Joi.number().precision(2).positive().messages({
    "string.base": "Amount should be an integer",
    "number.precision": "Amount must have up to 2 decimal places",
    "number.positive": "Amount must be greater than zero",
  }),
});
export const getExpenseSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id should be an integer",
    "any.required": "Id cannot be empty",
  }),
  user_id: Joi.string().required().messages({
    "string.base": "User Id should be a string",
    "any.required": "User Id cannot be empty",
  }),
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
  descp: Joi.string().max(150).messages({
    "string.base": "descp should be a string",
    "string.max": "descp cannot be more than 100 chars",
    "any.required": "descp cannot be empty",
  }),
});
export const getNotesSchema = Joi.object({
  id: Joi.number().required().messages({
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
  descp: Joi.string().max(150).messages({
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
  id: Joi.number().required().messages({
    "number.base": "Id should be an integer",
    "any.required": "Id cannot be empty",
  }),
});
export const getTravelPhotosSchema = Joi.object({
  travel_id: Joi.number().required().messages({
    "number.base": "Travel Id should be an integer",
    "any.required": "Travel Id cannot be empty",
  }),
});

// finace

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
