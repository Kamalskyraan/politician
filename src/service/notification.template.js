import express from "express";

export const NOTIFICATION_TEMPLATES = {
  MEETING_CREATED: {
    type: 1,
    title: "Meeting Created",
    message: "A new meeting has been scheduled.",
  },

  MEETING_UPDATED: {
    type: 2,
    title: "Meeting Updated",
    message: "Meeting details have been rescheduled.",
  },
};
