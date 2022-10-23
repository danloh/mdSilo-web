// helper 

export function getOS() {
  const SSR = typeof window === "undefined";
  if (SSR) return;
  const platform = window.navigator.platform ?? '';
  if (platform.indexOf('Win') !== -1) {
    return 'Win';
  } else if (platform.indexOf('Linux') !== -1) {
    return 'Linux';
  } else if (platform.indexOf('Mac') !== -1) {
    return 'Mac';
  }
}

export const nowToRadix36Str = () => {
  const now = Math.floor(Date.now() / 100); // 0.1s
  const strR = now.toString(36); // radix = 36
  return strR;
}

export const getNoteAsBlob = (content: string) => {
  const blob = new Blob([content], {
    type: 'text/markdown;charset=utf-8',
  });
  return blob;
};

export function decodeHTMLEntity(text: string) {
  const dummy = document.createElement("div");
  const txt = text.replace(
    /(&(?!(amp|gt|lt|quot|apos))[^;]+;)/g, // excerpt these html entities
    (a: string) => {
      dummy.innerHTML = a;
      return dummy.textContent || ' '; // real value
    }
  );

  return txt;
}

// file and path

/**
 * trim slash or backslash
 * @param txt 
 * @param mode start or end
 * @returns triemed txt
 */
 function trimSlash(txt: string, mode = 'start') {
  if (mode === 'start') {
    while (txt.startsWith('/') || txt.startsWith('\\')) {
      txt = txt.substring(1);
    }
    return txt;
  } else {
    while (txt.endsWith('/') || txt.endsWith('\\')) {
      txt = txt.substring(0, txt.length - 1);
    }
    return txt;
  }
}

// export for test
export function trimSlashAll(txt: string) {
  const txt0 = trimSlash(txt);
  const txt1 = trimSlash(txt0, 'end');
  return txt1;
}

/**
 * Normalize slashes of a file path, sync version
 * @param {string} path
 * @returns {string}
 */
 export const normalizeSlash = (path: string): string => {
  // replace all '\' to '/'
  path = path.replace(/\\/g, '/');
  // not end with '/', consistent with rust end: paths::normalize_slash
  return trimSlash(path, 'end') || '/';
};

/**
 * Join multi path parts into a string. sync version
 * @param {string[]} ...args paths
 * @returns {string}
 */
export const joinPath = (...args: string[]): string => {
  if (args.length === 0) { return '.'; }

  let joined: string | undefined = undefined;
  for (const arg of args) {
    if (arg.length > 0) {
      if (joined === undefined) {
        joined = trimSlash(normalizeSlash(arg), 'end');
      } else {
        joined += `/${trimSlashAll(arg)}`;
      }
    }
  }
  return joined || '.';
};

// date
//
// string: yyyy-mm-dd
export const regDateStr = /^([0-9]{4})-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/;

export function getStrDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// convert yyyy-mm-dd to date
export function strToDate(str: string) {
  if (!regDateStr.test(str)) return new Date();
  const ymd = str.split("-");
  const date = new Date(Number(ymd[0]), Number(ymd[1]) - 1, Number(ymd[2]));
  return date;
}

export function dateCompare(d1: string, d2: string) {
  return new Date(d1).getTime() - new Date(d2).getTime();
}

export function realDateCompare(d1: Date, d2: Date) {
  return d1.getTime() - d2.getTime();
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

// shorten a string but must include centre text
export function shortenString(txt: string, centre: string, len = 128) {
  const txtLen = txt.length;
  if (txtLen <= len) {
    return txt.replaceAll(centre, `==${centre}==`);
  }
  
  const idx = txt.indexOf(centre);
  const cenLen = centre.length;
  const step = Math.floor((len - cenLen) / 2);
  const span1 = idx - step; 
  const span2 = idx + cenLen + step;
  const start = Math.max(span1 + Math.min(txtLen - span2, 0), 0);
  const end = Math.min(txtLen, span2 - Math.min(span1, 0));

  return txt.substring(start, end).replaceAll(centre, `==${centre}==`);
}

const ymdNums = (date: string) => {
  const nums =  date.split('-').map(n => Number(n));
  return nums;
};
export function dailyTitleEqual(str1: string, str2: string) {
  if (!regDateStr.test(str1) || !regDateStr.test(str2)) return false;
  return ymdNums(str1).join('') === ymdNums(str2).join('');
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
