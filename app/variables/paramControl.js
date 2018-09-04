export const paramsDataProcessing = [
  {
    name: 'Binary Threshold (min)',
    defaultValue: 40,
    min: 0,
    max: 255,
    variable: 'minBinaryThreshold'
  },
  {
    name: 'Binary Threshold (max)',
    defaultValue: 100,
    min: 0,
    max: 255,
    variable: 'maxBinaryThreshold'
  },
  {
    name: 'GaussianBlur',
    defaultValue: 0,
    min: 0,
    max: 20,
    variable: 'gaussianBlur'
  }
];

export const paramsDetectCircles = [
  {
    name: 'dp',
    defaultValue: 2.4,
    min: 0,
    max: 10,
    variable: 'dp'
  },
  {
    name: 'Center distance',
    defaultValue: 40,
    min: 0,
    max: 500,
    variable: 'centerDistance'
  },
  {
    name: 'Radius (min)',
    defaultValue: 10,
    min: 1,
    max: 300,
    variable: 'minRadius'
  },
  {
    name: 'Radius (max)',
    defaultValue: 80,
    min: 10,
    max: 400,
    variable: 'maxRadius'
  }
];

export const defaultParams = {
    minBinaryThreshold: 40,
    maxBinaryThreshold: 100,
    gaussianBlur: 0,
    dp: 2.4,
    centerDistance: 40,
    minRadius: 10,
    maxRadius: 80
  };