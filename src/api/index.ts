import axios, { AxiosError } from "axios";
import {
  terrorZoneApiPath,
  terrorZoneApiUsername,
  terrorZoneApiToken,
} from "@/constants";

function handleAxiosError(error: AxiosError, text?: string) {
  if (error.response) {
    return text ? text : "Something went wrong. Try again later.";
  } else if (error.request) {
    return "No response from server!";
  } else {
    return "Request Error!";
  }
}

export const telegramHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

export const terrorZoneHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "x-emu-username": terrorZoneApiUsername,
  "x-emu-token": terrorZoneApiToken,
};

export const terrorZonesAxios = axios.create({
  headers: terrorZoneHeaders,
});

export const telegramAxios = axios.create({
  headers: telegramHeaders,
});

export async function sendTelegramNotification(
  message?: string
): Promise<void> {
  try {
    const url = `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage?parse_mode=HTML`;
    const response = await telegramAxios.post(url, {
      chat_id: process.env.NEXT_PUBLIC_CHAT_ID,
      text: message ?? "Message from Site",
    });
    console.log("Message sent successfully:", response.data);
  } catch (error: any) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
  }
}

// userAxios.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `${token}`;
//   }
//   return config;
// });

// functions

export const getTerrorZones = async () => {
  try {
    const response = await terrorZonesAxios.get(`${terrorZoneApiPath}`);
    const { data } = response;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return handleAxiosError(error, error.message);
    }
  }
};

export const getTelegramInfo = async () => {
  try {
    const response = await terrorZonesAxios.get(
      `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/getUpdates`
    );
    const { data } = response;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return handleAxiosError(error, error.message);
    }
  }
};
