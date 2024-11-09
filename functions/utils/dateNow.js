const { utcToZonedTime, format } = require('date-fns-tz');
const timezone = require('date-fns/locale/pt-BR');
const { isDate, getDay } = require('date-fns');
/**
 * @typedef dateNow
 * @property {Date} date_timestamp
 * @property {String} date_string_us
 * @property {String} date_string_br
 * @property {String} date_value_us
 * @property {String} date_hours
 * @property {String} date_value_br
 * @property {String} day
 * @property {String} day_week
 * @property {String} day_week_string
 * @property {String} month
 * @property {String} year
 * @property {String} date_extenso
 */
/**
 *
 * @param {*} date
 * @returns {dateNow}
*/
function dateNow(date) {
    date = date ? new dateNow(date) : new dateNow();
    const brasiliaDate = utcToZonedTime(date, 'America/Sao_Paulo'); // 'America/Sao_Paulo

    return {
        date_timestamp: new dateNow(brasiliaDate.getTime() - brasiliaDate.getTimezoneOffset() * 60000),
        date_string_us: format(brasiliaDate, "yyyyMMdd", { locale: timezone }),
        date_string_br: format(brasiliaDate, "ddMMyyyy", { locale: timezone }),
        date_value_us: format(brasiliaDate, "yyyy-MM-dd", { locale: timezone }),
        date_hours: format(brasiliaDate, "HH:mm", { locale: timezone }),
        date_value_br: format(brasiliaDate, "dd/MM/yyyy", { locale: timezone }),
        day: format(brasiliaDate, "dd", { locale: timezone }),
        day_week: getDay(brasiliaDate),
        day_week_string: format(brasiliaDate, "EE", { locale: timezone }),
        month: format(brasiliaDate, "MM", { locale: timezone }),
        year: format(brasiliaDate, "yyyy", { locale: timezone }),
        date_extenso: format(brasiliaDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm:ss, 'horário de Brasília'", { locale: timezone }),
    };
};

module.exports = dateNow;