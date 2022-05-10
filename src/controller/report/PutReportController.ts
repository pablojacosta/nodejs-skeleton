import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPut, request, response } from "inversify-express-utils";
import { TYPES } from "../../config/ioc/types";
import { Report } from "../../entity/Report";
import { User } from "../../entity/User";
import { IReportRepository } from "../../repository/ReportRepository";
import { IUserRepository } from "../../repository/UserRepository";
import { IUpdateReportDto, IUpdateReportService } from "../../service/report/UpdateReportService";

@controller("/reports")
export class PutReportController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
    @inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository;
    @inject(TYPES.UpdateReportService) private readonly updateReportService: IUpdateReportService;

    @httpPut("/:id")
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const user: User | null = await this.userRepository.findOneById(request.body.userId);
        const report: Report | null = await this.reportRepository.findOneById(request.params.id);

        if (user === null) {
            return response.status(400).send({ error: `User with id: ${request.body.userId} doesn't exist` });
        }

        if (report === null) {
            return response.status(404).send({ error: `Report with id: ${request.params.id} not found` });
        }

        await this.updateReportService.update(report, request.body as IUpdateReportDto);

        return response.status(200).send(report);
    }
}
