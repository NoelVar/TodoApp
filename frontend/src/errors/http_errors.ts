class httpError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * NOTE: Status code: 401
 */
export class UnauthorizedError extends httpError {}

/**
 * NOTE: Status code: 409
 */
export class ConflictError extends httpError {}

/**
 * NOTE: Status code : 404
 */
export class BadRequestError extends httpError {}

// Add more if needed for distinction