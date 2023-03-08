import axios from "axios";
import { parseISO } from "date-fns";

import jsonConfig from "@config/config.json";

// Sets the base url for all backend requests
const backend_axios = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:8080" : jsonConfig.productionServerUrl
})

// Converts dates in recived data from backend
backend_axios.interceptors.response.use(originalResponse => {
  handleDatesAndNull(originalResponse.data);
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

const handleDatesAndNull = (body: any) => {
  if (body === null || body === undefined || typeof body !== "object") {
    return body;
  };
  
  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = parseISO(value);
    if (value === null) body[key] = undefined;
    else if (typeof value === "object") handleDatesAndNull(value);
  }
}

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------