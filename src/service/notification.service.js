import admin from "firebase-admin";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { apnProvider } from "./apnProvider.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(
  __dirname,
  "./political-app-70f93-bac165acf56c.json",
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(fs.readFileSync(serviceAccountPath, "utf8")),
    ),
  });
}

export const sendPushNotification = async ({ user_id, payload }) => {
  try {
    const devices = await executeQuery(
      `SELECT device_token, device_type
       FROM user_device
       WHERE user_id = ? AND device_token IS NOT NULL`,
      [user_id],
    );

    if (!devices.length) return;

    const androidTokens = [];
    const iosTokens = [];

    for (const d of devices) {
      if (d.device_type === "android") {
        androidTokens.push(d.device_token);
      } else if (d.device_type === "ios") {
        iosTokens.push(d.device_token);
      }
    }

    if (androidTokens.length) {
      await admin.messaging().sendEachForMulticast({
        tokens: androidTokens,
        notification: {
          title: payload.title,
          body: payload.message,
        },
      });
    }

    if (iosTokens.length) {
      await sendAPNSNotification({
        tokens: iosTokens,
        title: payload.title,
        body: payload.message,
      });
    }
  } catch (err) {
    console.error("Push Notification Error:", err);
  }
};
//
export const sendFCMNotification = async ({ token, title, body, data }) => {
  await admin.messaging().send({
    token,
    notification: {
      title,
      body,
    },
    data: {
      ...data,
    },
  });
};

export const sendAPNSNotification = async ({ tokens, title, body }) => {
  try {
    const notification = new apn.Notification();

    notification.alert = { title, body };
    notification.topic = process.env.IOS_BUNDLE_ID;

    const result = await apnProvider.send(notification, tokens);

    result.failed.forEach((f) => {
      console.error("❌ Token:", f.device);
      console.error("❌ Error:", f.response?.reason || f.error);
    });

    return result;
  } catch (err) {
    console.error("APNS Error:", err);
  }
};
