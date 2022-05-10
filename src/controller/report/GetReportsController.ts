import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, request, response } from "inversify-express-utils";
import { TYPES } from "../../config/ioc/types";
import { Report } from "../../entity/Report";
import { IReportRepository } from "../../repository/ReportRepository";

const defaultOffset = 0;
const defaultLimit = 20;

@controller("/reports")
export class GetReportsController extends BaseHttpController {
    @inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository;

    @httpGet("/")
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
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
