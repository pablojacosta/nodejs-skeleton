import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import bootstrap from "./config/bootstrap";

async function run(): Promise<void> {
    const app = await bootstrap();

    app.listen(process.env.HTTP_PORT, () => {
        console.log(
            `⚡️[HttpServer]: Server is running at http://localhost:${process.env.HTTP_PORT} as ${process.env.NODE_ENV}.`
        );
    });
}

if (fs.existsSync(path.join(__dirname, "../.env"))) {
    run();
} else {
    console.log(
        `⚠️  ERROR: cannot start application, .env file not found. Did you forget to create it using .env.dist as template? ⚠️`
    );
}
