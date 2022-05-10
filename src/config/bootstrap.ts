import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { buildProviderModule } from "inversify-binding-decorators";
import { Container } from "inversify";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import winston, { format } from "winston";
import { TYPES } from "./ioc/types";
import { loadParameters } from "./ioc/parameters";
import { DEV } from "./environments";
import { IConnectionManager } from "../utils/mongodb/ConnectionManager";
import { Exception } from "../exception/Exception";

import "./ioc/loader";

// create the container
const container = new Container();

const bootstrap = async (test: boolean = false): Promise<Application> => {
    dotenv.config({ path: path.resolve(__dirname + "/../../.env" + (test ? ".test" : "")) });

    // create logger
    const logger = winston.createLogger({
        format: format.combine(format.timestamp(), format.json()),
        transports: [new winston.transports.Console({ level: "debug" })],
    });

    loadParameters(container);

    // add classes with @provide decorator into the container
    container.load(buildProviderModule());
    await container.get<IConnectionManager>(TYPES.ConnectionManager).connect();

    // start inversify express server
    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
        app.use(
            express.urlencoded({
                extended: true,
            })
        );
        app.use(express.json());
        app.use(
            cors({
                origin: process.env.CORS_ALLOWED_ORIGIN,
                methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "PATCH"],
            })
        );
    });

    server.setErrorConfig((app) => {
        app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
            if (error instanceof Exception) {
                return res.status(error.code).json({ error: error.message });
            }

            logger.log({
                level: "error",
                message: "An unhandled error ocurred during a request",
                meta: {
                    url: req.originalUrl,
                    method: req.method,
                    body: JSON.stringify(req.body),
                },
                error,
            });

            return res
                .status(500)
                .json({ error: process.env.NODE_ENV === DEV ? (error as Error).toString() : "Something went wrong!" });
        });
    });

    return server.build();
};

export { container };
export default bootstrap;
