import { Exception } from "./Exception";

export class ServiceValidationException extends Exception {
    constructor(message: string) {
        super(message, 400);
    }
}
