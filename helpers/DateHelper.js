//today
const today = new Date();

//yesterday
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

//first day of this week
const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
startOfWeek.setHours(0, 0, 0, 0);

//last day of this week
const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
endOfWeek.setHours(23, 59, 59, 999);

//first day of last week
const startOfLastWeek = new Date(today.setDate(today.getDate() - today.getDay() - 6));
startOfWeek.setHours(0, 0, 0, 0);

//last day of last week
const endOfLastWeek = new Date(today.setDate(today.getDate() - today.getDay() + 0));
endOfWeek.setHours(23, 59, 59, 999);

module.exports = {
  today,
  yesterday,
  startOfWeek,
  endOfWeek,
  startOfLastWeek,
  endOfLastWeek
}