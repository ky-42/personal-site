import axios from "axios";
import { parseISO } from "date-fns";

const backend_axios = axios.create({
  baseURL: "https://api.kyledenief.me"
})

backend_axios.interceptors.response.use(originalResponse => {
  handleDates(originalResponse.data);
  return originalResponse;
})

export default backend_axios;


// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

// Converts dates on all axios requests to a date object instead of a string
// Credit: https://stackoverflow.com/a/66238542

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && isoDateFormat.test(value);
}

const handleDates = (body: any) => {
  if (body === null || body === undefined || typeof body !== "object") {
    return body;
  };
  
  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = parseISO(value);
    else if (typeof value === "object") handleDates(value);
  }
}

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------