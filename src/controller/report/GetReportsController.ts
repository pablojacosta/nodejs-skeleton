import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, request, response } from "inversify-express-utils";
import { TYPES } from "../../config/ioc/types";
import { Report } from "../../entity/Report";
import { User } from "../../entity/User";
import { IReportRepository } from "../../repository/ReportRepository";
import { IUserRepository } from "../../repository/UserRepository";

const defaultOffset = 0;
const defaultLimit = 20;

@controller("/reports")
export class GetReportsController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
    @inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository;

    @httpGet("/")
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        if (request.query.userId) {
            const user: User | null = await this.userRepository.findOneById(request.query.userId.toString());

            if (user === null) {
                return response.status(400).send({ error: `User with id: ${request.query.userId} doesn't exist` });
            }
        }

        const reports: Report[] = await this.reportRepository.findAllFilteredAndPaginated(
            Number(request.query.offset ?? defaultOffset),
            Number(request.query.limit ?? defaultLimit),
            request.query.userId?.toString(),
            Number(request.query.dateFrom),
            Number(request.query.dateTo)
        );

        return response.status(200).send(reports);
    }
}
