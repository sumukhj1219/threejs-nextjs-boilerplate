
export default class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    details?: Record<string, unknown> | unknown[];

    constructor(
        message: string,
        statusCode = 500,
        isOperational = true,
        details?: Record<string, unknown> | unknown[]
    ) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = isOperational;
        this.details = details

        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this, this.constructor)
    }

    toJSON() {
        return {
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
            ...(this.details && { details: this.details }),
        }
    }
}

export class BadRequestError extends AppError {
    constructor(message="Bad Request", details?:Record<string, unknown> | unknown[]){
        super(message, 400, false, details)
    }
}

export class InternalServerError extends AppError {
    constructor(
        message = "Internal Server Error",
        details?: Record<string, unknown> | unknown[]
    ) {
        super(message, 500, false, details);
        this.name = "InternalServerError";
    }
}

export class GithubError extends AppError {
    constructor(message:string, statusCode=400, details?:Record<string, unknown> | unknown[]){
        super(message, statusCode, true, details)
        this.name = "GithubError"
    }
}
