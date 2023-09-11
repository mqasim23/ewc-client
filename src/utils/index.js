export const setStyle = (Properties, position = 'absolute', background) => {
  return {
    position: Properties?.Posn ? 'absolute' : 'relative',
    height: Properties?.Size && Properties?.Size[0],
    width: Properties?.Size && Properties?.Size[1],
    top: Properties?.Posn && Properties?.Posn[0],
    left: Properties?.Posn && Properties?.Posn[1],
  };
};

export const excludeKeys = (obj) => {
  const keysToExclude = ['ID', 'Properties'];
  const result = {};
  for (const key in obj) {
    if (!keysToExclude.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const checkPeriod = (ID) => {
  let count = 0;
  for (let i = 0; i < ID.length; i++) {
    if (ID[i] == '.') {
      count++;
    }
  }

  return count;
};

export const extractStringUntilSecondPeriod = (inputString) => {
  const lastPeriodIndex = inputString.lastIndexOf('.');

  if (lastPeriodIndex !== -1) {
    const result = inputString.slice(0, lastPeriodIndex);
    return result;
  }

  return inputString;
};
