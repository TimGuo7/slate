import BCrypt from "bcryptjs";

//NOTE(martina): this file is for utility functions that do not involve API calls
//For API related utility functions, see common/user-behaviors.js
//And for uploading related utility functions, see common/file-utilities.js

export const getPublicAndPrivateFiles = ({ viewer }) => {
  let publicFileIds = [];
  for (let slate of viewer.slates) {
    if (slate.isPublic) {
      publicFileIds.push(...slate.objects.map((obj) => obj.id));
    }
  }

  let publicFiles = [];
  let privateFiles = [];
  let library = viewer.library || [];
  for (let file of library) {
    if (file.isPublic || publicFileIds.includes(file.id)) {
      publicFiles.push(file);
    } else {
      privateFiles.push(file);
    }
  }
  return { publicFiles, privateFiles };
};

export const generateNumberByStep = ({ min, max, step = 1 }) => {
  var numbers = [];
  for (var n = min; n <= max; n += step) {
    numbers.push(n);
  }

  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
};

export const endsWithAny = (options, string) =>
  options.some((option) => {
    if (string) {
      return string.endsWith(option);
    } else {
      return false;
    }
  });

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

export const getRandomNumberBetween = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

export const extendEmotionCss = (styles, propStyles) => {
  if (!propStyles) return styles;
  return [styles, propStyles].flat();
};
