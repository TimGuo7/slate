import BCrypt from "bcryptjs";

import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as Constants from "~/common/constants";

import moment from "moment";

//NOTE(martina): this file is for utility functions that do not involve API calls
//For API related utility functions, see common/user-behaviors.js
//And for uploading related utility functions, see common/file-utilities.js

export const getImageUrlIfExists = (file, sizeLimit = null) => {
  if (!file) return;
  const coverImage = file.coverImage;
  if (coverImage) {
    if (sizeLimit && coverImage.size && coverImage.size > sizeLimit) {
      return;
    }
    if (coverImage.url) {
      return coverImage.url;
    }
    if (coverImage.cid) {
      return Strings.getURLfromCID(coverImage.cid);
    }
  }

  if (Validations.isPreviewableImage(file.type)) {
    if (sizeLimit && file.size > sizeLimit) {
      return;
    }
    return Strings.getURLfromCID(file.cid);
  }
};

export const generateNumberByStep = ({ min, max, step = 1 }) => {
  var numbers = [];
  for (var n = min; n <= max; n += step) {
    numbers.push(n);
  }

  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
};

export const encryptPasswordClient = async (text) => {
  const salt = "$2a$06$Yl.tEYt9ZxMcem5e6AbeUO";
  let hash = text;
  const rounds = 5;

  for (let i = 1; i <= rounds; i++) {
    hash = await BCrypt.hash(text, salt);
  }

  return hash;
};

export const coerceToArray = (input) => {
  if (!input) {
    return [];
  }
  if (Array.isArray(input)) {
    return input;
  } else {
    return [input];
  }
};

export const getFileExtension = (filename) => filename?.split(".").pop();

export const getTimeDifferenceFromNow = (date, format = {}) => {
  const defaultFormats = {
    seconds: (time) => time + "s",
    minutes: (time) => time + "m",
    hours: (time) => time + "h",
    days: (time) => time + "d",
    currentYear: (month, day) => `${month} ${day}`,
    default: (month, day, year) => `${month} ${day}, ${year}`,
  };

  const formatDate = { ...defaultFormats, ...format };

  const pastDate = new Date(date);
  const now = new Date();

  const differenceInSeconds = Math.floor((now - pastDate) / 1000);
  if (differenceInSeconds < 60) {
    return formatDate.seconds(differenceInSeconds);
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  if (differenceInMinutes < 60) {
    return formatDate.minutes(differenceInMinutes);
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);
  if (differenceInHours < 24) {
    return formatDate.hours(differenceInHours);
  }

  const differenceInDays = Math.floor(differenceInHours / 24);
  if (differenceInDays < 24) {
    return formatDate.days(differenceInDays);
  }

  const currentYear = now.getFullYear();

  const day = pastDate.getDay();
  const month = pastDate.toLocaleString("default", { month: "short" });
  const year = pastDate.getFullYear();

  if (year === currentYear) {
    return formatDate.currentYear(month, day);
  }

  return formatDate.default(month, day, year);
};

const isObject = (val) => val instanceof Object;

/**
 NOTE(amine): This will take a prop and return a responsive object that we can use with emotion.
 Let's say we have a size prop with current values {base: 64, mobile: 120}, and a mapper function 
 (size)=> ({width: size, height: size}). 
 It will return a responsive object 
 { width: 64, height: 64, 
  '@media (min-width: 768px':{ width: 120, height: 120 } }
 */
export function mapResponsiveProp(prop, mapper) {
  if (isObject(prop)) {
    const { base, ...restProps } = prop;
    let initialStyles = mapper(base) || {};

    return Object.keys(restProps).reduce((styles, size) => {
      const media = `@media (min-width: ${Constants.sizes[size]}px)`;
      const mediaStyles = mapper(restProps[size]);
      styles[media] = mediaStyles;
      return styles;
    }, initialStyles);
  }

  if (prop !== null) {
    return mapper(prop);
  }

  return null;
}

export const copyToClipboard = (text) => navigator.clipboard.writeText(text);

export function formatDateToString(date) {
  const providedDate = moment(date);
  const today = moment();
  const yesterday = moment().subtract(1, "day");

  if (today.isSame(providedDate, "day")) {
    return "Today at " + providedDate.format("h:mmA");
  }

  if (yesterday.isSame(providedDate, "day")) {
    return "Yesterday at " + providedDate.format("h:mmA");
  }

  return providedDate.format("MMM D, YYYY") + " at " + providedDate.format("h:mmA");
}

export const clamp = (value, min, max) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};
