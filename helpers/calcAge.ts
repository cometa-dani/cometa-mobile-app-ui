/**
 * 
 * @description calculates the age of a person in years given its birthDate
 * @param birthDate {Date}
 * @returns number
 */
export function calAge(birthDate: Date): number {
  const minutes = 60;
  const seconds = 60;
  const milliseconds = 1000;
  const hours = 24;
  const days = 365;

  const age = (
    (Date.now() - birthDate.getTime())
    /
    (milliseconds * seconds * minutes * hours * days)
  );

  return Math.floor(age);
}
