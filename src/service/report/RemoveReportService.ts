import { inject } from "inversify";
import { TYPES } from "../../config/ioc/types";
import { Report } from "../../entity/Report";
import { IReportRepository } from "../../repository/ReportRepository";
import { provideSingleton } from "../../utils/inversify/CustomProviders";

export interface IRemoveReportService {
    remove(report: Report): Promise<void>;
}

@provideSingleton(TYPES.RemoveReportService)
export class RemoveReportService implements IRemoveReportService {
    constructor(@inject(TYPES.ReportRepository) private readonly reportRepository: IReportRepository) {}

    public async remove(report: Report): Promise<void> {
        await this.reportRepository.remove(report);
    }
}
