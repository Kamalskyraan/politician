import express from "express";

export class notificationModel {
  async addNotification(data) {
    const {receiver_id, title, message, type, extra} = data;
    console.log(receiver_id, title, message, type, extra);
  }
}
