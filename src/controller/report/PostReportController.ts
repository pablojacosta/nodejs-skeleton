import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPost, request, response } from "inversify-express-utils";
import { TYPES } from "../../config/ioc/types";
import { Report } from "../../entity/Report";
import { User } from "../../entity/User";
import { IUserRepository } from "../../repository/UserRepository";
import { ICreateReportDto, ICreateReportService } from "../../service/report/CreateReportService";
import { postAndPutReportValidator } from "../../validator/report/postAndPutReportValidator";

@controller("/reports")
export class PostReportController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
    @inject(TYPES.CreateReportService) private readonly createReportService: ICreateReportService;

    @httpPost("/", TYPES.AuthorizationMiddleware, ...postAndPutReportValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const user: User | null = await this.userRepository.findOneById(request.body.userId);

        if (user === null) {
            return response.status(400).send({ error: `User with id: ${request.body.userId} doesn't exist` });
        }

        const report: Report = await this.createReportService.create(request.body as ICreateReportDto);

        return response.status(201).send(report);
    }
}
