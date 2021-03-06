import moment from "moment";

import { Schedule } from "../api/schedules.d";

/**
 * Get the current time in a human readable timestamp
 */
export const getHumanTimestamp = () => {
  return moment().format("h:mm:ss a");
};

/**
 * Check if a YYYY-MM-DD formated date is valid
 */
export const isDateStringValid = (date: string): boolean => date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) !== null;

/**
 * Calculate the age in years based on birthdate
 */
export const getAge = (birthdate: string) => {
  return moment().diff(birthdate, "years");
};

/**
 * Check if a day is valid for a given schedule (must be a weekday)
 */
export const isDayValid = (schedule: Schedule, date: string | Date, ignoreExcluded: boolean = false) => {
  const dateMoment = moment(date);
  const dayOfWeek = dateMoment.day();

  return (
    dateMoment.isBetween(schedule.startDate, schedule.endDate, "day", "[]") &&
    dayOfWeek !== 0 &&
    dayOfWeek !== 6 &&
    (ignoreExcluded || !schedule.excludedDates?.includes(dateMoment.format("YYYY-MM-DD")))
  );
};

/**
 * Get all the valid days in a given schedule
 */
export const getDaysInSchedule = (schedule: Schedule) => {
  const days: string[] = [];

  const currentMoment = moment(schedule.startDate);
  const endMoment = moment(schedule.endDate);

  while (currentMoment.isSameOrBefore(endMoment)) {
    if (isDayValid(schedule, currentMoment.toDate())) {
      days.push(currentMoment.format("YYYY-MM-DD"));
    }

    currentMoment.add(1, "days");
  }

  return days;
};
