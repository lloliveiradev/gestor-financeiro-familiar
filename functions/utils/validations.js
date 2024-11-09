const CustomError = require("./customError");

function validateContract(cls, update) {
    const contract = cls.contract;
    const data = cls.data;
    for (const key in contract) {
        if (contract[key].required) {
            if (data[key]) {
                if (contract[key].type != typeof data[key]) {
                    throw new CustomError({
                        message: contract[key].error,
                        status: 400
                    });
                };
            } else {
                if (!update && !Object.prototype.hasOwnProperty.call(data, key)) {
                    throw new CustomError({
                        message: contract[key].error,
                        status: 400
                    });
                };
            };
        };
    };
};

module.exports = { validateContract };