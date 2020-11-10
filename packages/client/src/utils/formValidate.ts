export const required = (value: number) => value || value===0 ? undefined : 'Required !';
const minValue = (min: number) => (value: number) =>
  value && value < min ? `Must be at least ${min}` : undefined;
const maxValue = (max: number) => (value: number) =>
  value && value > max ? `Must be less than ${max}` : undefined;


export const minPresentationTimeout = minValue(5);
export const maxPresentationTimeout = maxValue(30);
export const minTaskTimeout = minValue(30);
export const maxTaskTimeout = maxValue(345600);
export const minTaskCapacity = minValue(0);
export const maxTaskCapacity = maxValue(1);
export const minTaskPriority = minValue(0);
export const maxTaskPriority = maxValue(3);
