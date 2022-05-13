import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { PARAMETERS } from "../config/ioc/parameters";
import { TYPES } from "../config/ioc/types";
import { AuthenticationException } from "../exception/AuthenticationException";
import { provideSingleton } from "../utils/inversify/CustomProviders";

@provideSingleton(TYPES.AuthorizationMiddleware)
export class AuthorizationMiddleware extends BaseMiddleware {
    @inject(PARAMETERS.authorizationToken) private readonly token: string;

    public handler(request: Request, response: Response, next: NextFunction): void {
        if (!request.header("Authorization")) {
            next(new AuthenticationException("Authorization Header Expected"));
        }

        if (request.header("Authorization") !== this.token) {
            next(new AuthenticationException("Wrong Token"));
        }

        next();
    }
}
