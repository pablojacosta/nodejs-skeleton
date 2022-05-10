export const TYPES = {
    // utils
    ConnectionManager: Symbol.for("ConnectionManager"),

    // repository
    UserRepository: Symbol.for("UserRepository"),
    ReportRepository: Symbol.for("ReportRepository"),

    // service
    CreateUserService: Symbol.for("CreateUserService"),
    UpdateUserService: Symbol.for("UpdateUserService"),
    RemoveUserService: Symbol.for("RemoveUserService"),
    CreateReportService: Symbol.for("CreateReportService"),
    UpdateReportService: Symbol.for("UpdateReportService"),
    RemoveReportService: Symbol.for("RemoveReportService"),
};
