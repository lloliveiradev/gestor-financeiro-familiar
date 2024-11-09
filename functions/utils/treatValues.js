function treatValues(val, key, numberExceptions) {
    try {
        if (val.indexOf(',') > 0) return val.split(',');
        if (val.indexOf(';') > 0) return val.split(';');
        if (
            !isNaN(parseInt(val)) &&
            !key.includes('id') &&
            !numberExceptions.includes(key)
        ) return parseInt(val);
        if (val == 'true') return true;
        if (val == 'false') return false;
        if (val == 'null') return null;
        return val;
    } catch (error) {
        console.error(error);
        return val;
    };
};

module.exports = treatValues;