import express from "express";

export const NOTIFICATION_TEMPLATES = {
  MEETING_CREATED: {
    type: 1,
    title: "Meeting Created",
    message: "A new meeting has been scheduled.",
  },
  MEETING_UPDATED: {
    type: 1,
    title: "Meeting Updated",
    message: "Meeting details have been rescheduled.",
  },
  MEETING_OVERDUE: {
    type: 1,
    title: "Meeting Overdue",
    message:
      "This meeting has crossed its end date and is still in progress. Please update the meeting status.",
  },

  APPOINTMENT_CREATED: {
    type: 2,
    title: "Appointment Created",
    message: "A new appointment has been scheduled.",
  },
  APPOINTMENT_UPDATED: {
    type: 2,
    title: "Appointment Updated",
    message: "Appointment details have been rescheduled.",
  },
  APPOINTMENT_OVERDUE: {
    type: 2,
    title: "Appointment Overdue",
    message:
      "This Appointment has crossed its end date and is still in progress. Please update the Appointment status.",
  },

  TRAVEL_CREATED: {
    type: 3,
    title: "Travel Created",
    message: "A new travel has been scheduled.",
  },
  TRAVEL_UPDATED: {
    type: 3,
    title: "Travel Updated",
    message: "Travel details have been rescheduled.",
  },

  TASK_CREATED: {
    type: 4,
    title: "Task Created",
    message: "A new task has been scheduled.",
  },
  TASK_UPDATED: {
    type: 4,
    title: "Task Updated",
    message: "Task details have been rescheduled.",
  },
  TASK_OVERDUE: {
    type: 4,
    title: "Task Overdue",
    message:
      "This Task has crossed its end date and is still in progress. Please update the Task status.",
  },

  ISSUE_CREATED: {
    type: 5,
    title: "Issue Created",
    message: "A new issue has been scheduled.",
  },
  ISSUE_UPDATED: {
    type: 5,
    title: "Issue Updated",
    message: "Issue details have been rescheduled.",
  },
  ISSUE_OVERDUE: {
    type: 5,
    title: "Issue Overdue",
    message:
      "This Issue has crossed its end date and is still in progress. Please update the Issue status.",
  },

  SUMIT_CREATED: {
    type: 6,
    title: "Sumit Created",
    message: "A new sumit has been scheduled.",
  },
  SUMIT_UPDATED: {
    type: 6,
    title: "Sumit Updated",
    message: "Sumit details have been rescheduled.",
  },
  SUMIT_OVERDUE: {
    type: 6,
    title: "Sumit Overdue",
    message:
      "This Sumit has crossed its end date and is still in progress. Please update the Sumit status.",
  },
};
