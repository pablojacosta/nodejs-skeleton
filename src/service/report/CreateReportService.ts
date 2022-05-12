import { v4 as uuid } from "uuid";
import { inject } from "inversify";
import { TYPES } from "../../config/ioc/types";
import { provideSingleton } from "../../utils/inversify/CustomProviders";
import { Report } from "../../entity/Report";
import { IReportRepository } from "../../repository/ReportRepository";
import { IUserRepository } from "../../repository/UserRepository";
import { ServiceValidationException } from "../../exception/ServiceValidationException";

export interface ICreateReportDto {
    userId: string;
    title: string;
    content: string;
}

export interface ICreateReportService {
    create(dto: ICreateReportDto): Promise<Report>;
}

@provideSingleton(TYPES.CreateReportService)
export class CreateReportService implements ICreateReportService {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
    private readonly reportRepository: IReportRepository;

    constructor(@inject(TYPES.ReportRepository) reportRepository: IReportRepository) {
        this.reportRepository = reportRepository;
    }

    public async create({ userId, title, content }: ICreateReportDto): Promise<Report> {
        if (!(await this.userRepository.findOneById(userId))) {
            throw new ServiceValidationException(`User with id: ${userId} doesn't exist`);
        }

        const timestamp = (Date.now() / 1000) | 0;

        const report: Report = {
            id: uuid(),
            userId,
            title,
            content,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        await this.reportRepository.persist(report);

        return report;
    }
}
