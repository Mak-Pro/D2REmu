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

export const terrorZoneHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "x-emu-username": terrorZoneApiUsername,
  "x-emu-token": terrorZoneApiToken,
};

export const terrorZonesAxios = axios.create({
  headers: terrorZoneHeaders,
});

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
