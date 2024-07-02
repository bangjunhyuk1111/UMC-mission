// config/error.js

export class BaseError extends Error {
    constructor({ message, status, data }) {
        super(message);
        this.status = status;
        this.data = data;
    }
}