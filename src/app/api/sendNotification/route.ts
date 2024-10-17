import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

// VAPID ключи
const publicVapidKey =
  "BPb01NeHLI3QsdiuAPknI_GTbF2KsD5PZOnsCATb5174v6z3Beqjqcallr3mvYEQmgpZcmv0ycmQXAZYrCoIaPY";
const privateVapidKey = "tyJUP2WTgrA_rgBJ8N2q6B9ffOsG-BBekBRmQuSmZ0I";

webpush.setVapidDetails(
  "mailto:maksprocode@gmail.com", // Ваш email
  publicVapidKey,
  privateVapidKey
);

export async function POST(request: NextRequest) {
  try {
    const { subscription, title, body } = await request.json();

    const payload = JSON.stringify({
      title,
      body,
    });

    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
