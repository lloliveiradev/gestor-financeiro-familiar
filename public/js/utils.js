function dateDifference(reference, comparative) {
    let difference = Math.abs(reference - comparative) / 1000;
    const days = Math.floor(difference / 86400);
    difference -= days * 86400;
    const hours = Math.floor(difference / 3600) % 24;
    difference -= hours * 3600;
    return { days, hours };
};

function dateNow(custom) {
    let date;
    if (custom) {
        if (typeof custom === 'string') custom = new Date(custom).getTime() + 1 * 24 * 60 * 60 * 1000;
        date = new Date(custom);
    } else date = new Date();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const week_day = date.getDay(); //Sunday is 0!
    const month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const year = date.getFullYear();
    const full_date = {};
    full_date.date_string_us = `${year}${month}${day}`;
    full_date.date_timestamp = date;
    full_date.date_value_us = `${year}-${month}-${day}`;
    full_date.date_hours = `${hours}:${minutes}:${seconds}`;
    full_date.day = day;
    full_date.day_week = week_day;
    full_date.month = month;
    full_date.year = year;
    return full_date;
};

function formValidate(form_id) {
    $(`#${form_id} .mandatory`).each((ix, el) => {
        if (['', null, undefined].includes($(el).val())) {
            const label = $(`label[for="${$(el).attr('name')}"]`);
            return Swal.fire({
                title: 'Atention!',
                html: `Fill in the field <b>${label}</b> with a valid value.`,
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#0060b7',
            });
        };
    });
};

function formClean(form_id) {
    $(`#${form_id}`).find('input').val('');
    $(`#${form_id}`).find('input:checked').prop('checked', false);
    $(`#${form_id}`).find('select').val('');
    $(`#${form_id} .select2`).val('').trigger('change');
    $(`#${form_id}`).find('textarea').val('');
};

function formEnable(form_id, disabled = false) {
    $(`#${form_id} select`).prop('disabled', disabled);
    $(`#${form_id} input`).prop('disabled', disabled);
    $(`#${form_id} button`).prop('disabled', disabled);
    $(`#${form_id} textarea`).prop('disabled', disabled);
};

function pathToValue(data, path) {
    if (!(data instanceof Object) || typeof (path) === "undefined") {
        throw `Not valid argument: data: ${data} , path: ${path}`;
    };
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    let pathArray = path.split('.');
    for (let i = 0, n = pathArray.length; i < n; ++i) {
        const key = pathArray[i];
        if (key in data) {
            if (data[key] !== null) data = data[key];
            else return null;
        } else return null;
    };
    return data;
};

function localeUs(val) {
    return Number(val || 0).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

async function formFill(form_id, data) {
    await $(`#${form_id} input[type="checkbox"]`).each(async function () {
        const val = pathToValue(data, this.name);
        if (val != null) await $(`#${this.id}`).prop('checked', val ? true : false).trigger('change');
        else if (this.id) await $(`#${this.id}`).trigger('change');
    });

    await $(`#${form_id} select`).each(async function () {
        const val = pathToValue(data, this.name);
        if (val != null) await $(`#${this.id}`).val(val.value || '');
        else if (this.id) await $(`#${this.id}`).trigger('change');
    });

    await $(`#${form_id} input`).each(async function () {
        if (this.type != 'checkbox') {
            const val = pathToValue(data, this.name);
            if (this.id) {
                if ($(this).hasClass('float')) $(`#${this.id}`).val(localeUs(val));
                else if (val != null) {
                    if (this.type == 'date') $(`#${this.id}`).val(val.date_value_us);
                    if (this.type == 'datetime-local') $(`#${this.id}`).val(`${val.date_value_us}T${val.date_hours?.substring(0, 5) || '00:00'}`);
                    if (this.type == 'number') $(`#${this.id}`).val($(this).hasClass('percent') ? val * 100 : val);
                    if (this.type == 'email') $(`#${this.id}`).val(val?.toLowerCase());
                    if (this.type == 'tel') $(`#${this.id}`).val(val).trigger('keyup');
                    if (this.type == 'text') {
                        if ($(this).hasClass('int')) $(`#${this.id}`).val(val.toString());
                        else if ($(this).hasClass('mask')) $(`#${this.id}`).val(val).trigger('input').trigger('keyup');
                        else $(`#${this.id}`).val(val ? (typeof val == 'string' ? val.trim() : val) : '');
                    };
                    if (this.type == 'time') $(`#${this.id}`).val(val.date_hours.substring(0, 5));
                };
            };
        };
    });

    await $(`#${form_id} textarea`).each(function () {
        const val = pathToValue(data, this.name);
        if (val != null && this.id) {
            if (Array.isArray(val)) $(`#${this.id}`).val(val?.map(el => el.name)?.join('; ') || "");
            else $(`#${this.id}`).val(val?.trim() || "");
        };
    });
};

function preloader(show, msg) {
    if (show) $('#preloader_msg').html(msg || '').show();
    else $('#preloader').hide();
};

function age(date) {
    var birthday = + new Date(date);
    return ~~((Date.now() - birthday) / (31557600000));
};

async function regexAlpha(el) {
    const val = el.value.replace(/[^\D]/g, '');
    $(el).val(val);
};

async function regexNumber(el) {
    const key = e.key;
    if (!/^\d+$/.test(key)) {
        const value = $(el).val();
        $(el).val(value.replace(/\D/g, ''));
    };
};

function isValid(data, invalid, valid) {
    if (data == null) return invalid;
    if (data == undefined) return invalid;
    if (typeof data == 'number' && data == 0) return invalid;
    if (typeof data == 'object' && Object.keys(data).length == 0) return invalid;
    if (typeof data == 'string' && data.trim() == '') return invalid;
    if (Array.isArray(data) && data.length == 0) return invalid;
    return valid ? valid : data;
};

function shortenName(text, last) {
    if (!text) return '';

    const parts = text.split(' ');
    let name = parts[0];
    if (last) parts.length > 2 ? name += (' ' + parts[1].substr(0, 1) + '. ' + parts[parts.length - 1]) : parts.length > 1 ? name += ` ${parts[1]}` : name += '';
    else parts.length > 1 ? name += (' ' + parts[1].substr(0, 1) + '.') : name += '';

    return name;
};

function capitalize(text) {
    if (text == null || text == undefined || typeof text != 'string' || text.length == 0) return text;
    let formatted = '';
    text = text.replace(/\s\s+/g, ' ');
    let parts = text.trim().toLowerCase().split(' ');
    parts.forEach(part => {
        formatted += `${typeof part[0] == 'string' ? part[0].toUpperCase() : part[0]}${part.substring(1)} `
    });
    return formatted.trim();
};

function developing() {
    Swal.fire({
        title: 'Atention!',
        html: 'This feature is under development!',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#0060b7',
    });
};

window.previousPage = function () {
    window.history.go(-1);
};

async function businessDay(date) {
    if (date) {
        if ([0, 6].includes(dateNow(date).week_day)) return false;
        else return true;
    } else return false;
};

function onlyUnique(val, ix, array) {
    return array.indexOf(val) === ix;
};

function onlyUniqueObj(array, property) {
    const seen = new Set();
    return array.filter(el => {
        const val = el[property];
        if (seen.has(val)) return false;
        else {
            seen.add(val);
            return true;
        };
    });
};

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            title: 'Done!',
            html: `Text copied to the transfer area.`,
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#0060b7',
        });
    }).catch((error) => {
        Swal.fire({
            title: 'Sorry!',
            html: `An error occurred while coping the text.`,
            icon: 'warning',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#0060b7',
        });
        console.error(error);
    });
};

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return true;
    else return false;
};

Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
};

Date.prototype.addMonths = function (months) {
    let date = new Date(this.valueOf());
    let d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) date.setDate(0);
    return date;
};