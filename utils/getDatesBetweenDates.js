const moment = require('moment');

const DATE_FORMAT = 'YYYY-MM-DD';


function getDatesBetweenDates(startDate, endDate) {
  const dates = [];
  let currentDate = moment(startDate, DATE_FORMAT);
  const lastDate = moment(endDate, DATE_FORMAT);

  while (currentDate <= lastDate) {
    dates.push(currentDate.format(DATE_FORMAT));
    currentDate = currentDate.clone().add(1, 'd');
  }

  return dates;
}

module.exports = { getDatesBetweenDates };