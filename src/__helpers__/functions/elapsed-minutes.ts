function calculateElapsedMinutesGivenDate(dateToCalculateFrom: Date){
 const currentTime = new Date().getTime();

 const diff = currentTime - dateToCalculateFrom.getTime();
 return Math.round(diff / (1000 * 60));

}

export const ElapsedMinutes = { calculateElapsedMinutesGivenDate }