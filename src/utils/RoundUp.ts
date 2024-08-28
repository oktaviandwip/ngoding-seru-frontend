export function RoundUp(number: number) {
  const stringNumber = number.toString();
  const decimalIndex = stringNumber.indexOf(".");
  if (decimalIndex === -1) {
    return number;
  }
  const lastTwoDigits = stringNumber.substring(
    decimalIndex + 1,
    decimalIndex + 3
  );
  const roundedLastTwoDigits = Math.ceil(parseFloat(lastTwoDigits));
  const result = parseFloat(
    stringNumber.substring(0, decimalIndex) + "." + roundedLastTwoDigits
  );
  return result;
}
