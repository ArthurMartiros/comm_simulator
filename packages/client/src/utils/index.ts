export function selectRandomItem(arr: any[]) {
  let length = arr.length;
  let k = Math.floor(Math.random() * length);
  return arr[k];
}

export function generateRandomString() {
  return `${Math.floor(Math.random() * 100000)}`;
}

export function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getFirstLetters(str: string) {
  return str.split('_').map((k) => k.charAt(0).toUpperCase()).join('');
}