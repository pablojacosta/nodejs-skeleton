import { Exception } from "./Exception";

const DEFAULT_MESSAGE: string = "Authorization required";

export class AuthenticationException extends Exception {
    constructor(message?: string) {
        super(message ?? DEFAULT_MESSAGE, 401);
    }
}
