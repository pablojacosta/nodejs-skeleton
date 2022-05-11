import { inject } from "inversify";
import { TYPES } from "../config/ioc/types";
import { Report } from "../entity/Report";
import { provideSingleton } from "../utils/inversify/CustomProviders";
import { IConnectionManager } from "../utils/mongodb/ConnectionManager";
import { MongoRepository } from "../utils/mongodb/MongoRepository";

export interface IReportRepository {
    persist(report: Report): Promise<void>;
    findAllFilteredAndPaginated(
        offset: number,
        limit: number,
        userId?: string,
        dateFrom?: number,
        dateTo?: number
    ): Promise<Report[]>;
    findOneById(id: string): Promise<Report | null>;
    remove(report: Report): Promise<void>;
}

const collectionName: string = "report";

@provideSingleton(TYPES.ReportRepository)
export class ReportRepository extends MongoRepository implements IReportRepository {
    constructor(@inject(TYPES.ConnectionManager) connectionManager: IConnectionManager) {
        super();
        this.collection = connectionManager.getCollection(collectionName);
    }

    public async findAllFilteredAndPaginated(
        offset: number,
        limit: number,
        userId?: string,
        dateFrom?: number,
        dateTo?: number
    ): Promise<Report[]> {
        const filter: { [key: string]: unknown } = {};

        userId ? (filter.userId = userId) : {};

        if (dateFrom && dateTo) {
            filter.createdAt = { $gte: dateFrom, $lte: dateTo };
            filter.updatedAt = { $gte: dateFrom, $lte: dateTo };
        } else if (dateFrom && !dateTo) {
            filter.createdAt = { $gte: dateFrom };
            filter.updatedAt = { $gte: dateFrom };
        } else if (!dateFrom && dateTo) {
            filter.createdAt = { $lte: dateTo };
            filter.updatedAt = { $lte: dateTo };
        }

        return await this.findBy(filter, null, offset, limit);
    }

    public async findOneById(id: string): Promise<Report | null> {
        return await this.findOneBy({ id });
    }
}
