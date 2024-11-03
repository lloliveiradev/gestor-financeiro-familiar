const CustomError = require("./customError");

function validateContract(data, except) {
    const contract = data.contract;
    for (const key in contract) {
        if (contract[key].required) {
            if (data[key]) {
                if (contract[key].type != typeof data[key]) {
                    throw new CustomError({
                        message: contract[key].error,
                        status: 400
                    })
                }
            } else {
                throw new CustomError({
                    message: contract[key].error,
                    status: 400
                })
            }
        }
    }
}

module.exports = validateContract;