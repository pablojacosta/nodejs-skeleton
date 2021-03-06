import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPut, request, response } from "inversify-express-utils";
import { TYPES } from "../../config/ioc/types";
import { Report } from "../../entity/Report";
import { IReportRepository } from "../../repository/ReportRepository";
import { IUpdateReportDto, IUpdateReportService } from "../../service/report/UpdateReportService";
import { paramIdValidator } from "../../validator/paramIdValidator";
import { postAndPutReportValidator } from "../../validator/report/postAndPutReportValidator";

@controller("/reports")
export class PutReportController extends BaseHttpController {
    @inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository;
    @inject(TYPES.UpdateReportService) private readonly updateReportService: IUpdateReportService;

    @httpPut("/:id", TYPES.AuthorizationMiddleware, ...paramIdValidator, ...postAndPutReportValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const report: Report | null = await this.reportRepository.findOneById(request.params.id);

        if (report === null) {
            return response.status(404).send({ error: `Report with id: ${request.params.id} not found` });
        }

        await this.updateReportService.update(report, request.body as IUpdateReportDto);

        return response.status(200).send(report);
    }
}
