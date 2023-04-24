// Converts dates on all axios requests to a date object instead of a string
// Credit: https://stackoverflow.com/a/66238542

import { parseISO } from 'date-fns';

export const isoDateFormat =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

export function isIsoDateString(value: any): boolean {
  return value && typeof value === 'string' && isoDateFormat.test(value);
}

export const handleDatesAndNull = (body: any) => {
  if (body === null || body === undefined || typeof body !== 'object') {
    return body;
  }

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = parseISO(value);
    if (value === null) body[key] = undefined;
    else if (typeof value === 'object') handleDatesAndNull(value);
  }
};

/* -------------------------------------------------------------------------- */

// Used to parse json with iso dates when using json.parse
export const jsonParser = (key: string, value: string) => {
  if (isIsoDateString(value)) return parseISO(value);
  return value;
};
