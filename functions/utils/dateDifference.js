
function dateDifference(date1, date2) {
    let diffInMilliSeconds = Math.abs(date1 - date2) / 1000;
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    return {
        dias: days,
        horas: hours,
    };
};

module.exports = dateDifference;