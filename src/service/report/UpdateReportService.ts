import { inject } from "inversify";
import { TYPES } from "../../config/ioc/types";
import { provideSingleton } from "../../utils/inversify/CustomProviders";
import { ServiceValidationException } from "../../exception/ServiceValidationException";
import { Report } from "../../entity/Report";
import { IReportRepository } from "../../repository/ReportRepository";
import { IUserRepository } from "../../repository/UserRepository";

export interface IUpdateReportDto {
    userId: string;
    title: string;
    content: string;
}

export interface IUpdateReportService {
    update(report: Report, dto: IUpdateReportDto): Promise<Report>;
}

@provideSingleton(TYPES.UpdateReportService)
export class UpdateReportService implements IUpdateReportService {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;

    private readonly reportRepository: IReportRepository;

    constructor(@inject(TYPES.ReportRepository) reportRepository: IReportRepository) {
        this.reportRepository = reportRepository;
    }

    public async update(report: Report, { userId, title, content }: IUpdateReportDto): Promise<Report> {
        if (!(await this.userRepository.findOneById(userId))) {
            throw new ServiceValidationException(`User with id: ${userId} doesn't exist`);
        }

        report.title = title;
        report.content = content;
        report.updatedAt = (Date.now() / 1000) | 0;

        await this.reportRepository.persist(report);

        return report;
    }
}
