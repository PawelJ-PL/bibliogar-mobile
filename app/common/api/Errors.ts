export class ApiError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ApiError.prototype)
    }
}

export class NotLoggedIn extends ApiError {
    constructor() {
        super('User not logged in');
        Object.setPrototypeOf(this, NotLoggedIn.prototype);
        this.name = 'NotLoggedIn'
    }
}

export class Forbidden extends ApiError {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, Forbidden.prototype);
        this.name = 'Forbidden'
    }
}

export class InvalidCredentials extends ApiError {
    constructor() {
        super('Invalid credentials');
        Object.setPrototypeOf(this, InvalidCredentials.prototype);
        this.name = 'InvalidCredentials'
    }
}
