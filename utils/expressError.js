class ExpressError extends Error {
    constructor(statusCode, message, details = "") {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
    }
}

module.exports = ExpressError;
