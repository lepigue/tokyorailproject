module.exports = {
  
  monthMap : {1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June",
              7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December"},

  convertDatetime: function (datetime) {
    let convertedDate =
      (datetime.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      datetime.getDate().toString().padStart(2, "0") +
      "-" +
      datetime.getFullYear().toString().padStart(4, "0");
      ;
    
    return convertedDate
  },

  convertDatetimeText: function (datetime) {
    day = datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate();
    month =
      datetime.getMonth() < 10
        ? `0${datetime.getMonth()}`
        : datetime.getMonth();
    year = datetime.getFullYear();
    
    return`${this.monthMap[datetime.getMonth()]} ${day}, ${year}`;
  },

  convertDatetimeHTML: function (datetime) {
    let convertedDate =
      datetime.getFullYear().toString().padStart(4, "0") +
      "-" +
      (datetime.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      datetime.getDate().toString().padStart(2, "0");
    
    return convertedDate
  },

  convertDateToUTC: function (date) {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
  }
}

