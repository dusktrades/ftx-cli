const HOURS_PER_YEAR = 8760;

function convertYearlyToHourly(rate) {
  return rate / HOURS_PER_YEAR;
}

export { convertYearlyToHourly };
