// helper 

// date
//
// string: mm-dd-yyyy
export const regDateStr = /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])-([0-9]{4})$/;

export function dateCompare(d1: string, d2: string) {
  return new Date(d1).getTime() - new Date(d2).getTime();
}

export function realDateCompare(d1: Date, d2: Date) {
  return d1.getTime() - d2.getTime();
}

export function getStrDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
}

// convert mm-dd-yyyy to date
export function strToDate(str: string) {
  if (!regDateStr.test(str)) return new Date();
  const mdy = str.split("-");
  const date = new Date(Number(mdy[2]), Number(mdy[0]) - 1, Number(mdy[1]));
  return date;
}

// device
const SM_BREAKPOINT = 640;

export const isMobile = (breakpoint: number = SM_BREAKPOINT) => {
  return window.innerWidth <= breakpoint;
};

// str
// 
// case Insensitive
export function ciStringCompare(str1: string, str2: string) {
  return str1.localeCompare(str2, undefined, {
    sensitivity: 'base',
    numeric: true,
  });
}

export function ciStringEqual(str1: string, str2: string) {
  return ciStringCompare(str1, str2) === 0;
}

// url 
// Adapted from https://stackoverflow.com/a/43467144
export const isUrl = (str: string) => {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export const queryParamToArray = (
  queryParam: string | string[] | undefined
) => {
  if (!queryParam) {
    return [];
  } else if (typeof queryParam === 'string') {
    return [queryParam];
  } else {
    return queryParam;
  }
};
