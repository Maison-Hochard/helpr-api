export type createCalendarInput = {
  summary: string;
  location: string;
  description: string;
  timeZone: string;
};

export type createEventInput = {
  calendarId: string;
  summary: string;
  location: string;
  description: string;
  endDateTime: string;
  timeZone: string;
  startDateTime: string;
};
