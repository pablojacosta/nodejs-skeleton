import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, request, response } from "inversify-express-utils";
import { TYPES } from "../../config/ioc/types";
import { User } from "../../entity/User";
import { IUserRepository } from "../../repository/UserRepository";
import { getUsersValidator } from "../../validator/user/getUsersValidator";

const defaultOffset = 0;
const defaultLimit = 20;

@controller("/users")
export class GetUsersController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;

    @httpGet("/", ...getUsersValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const users: User[] = await this.userRepository.findAllPaginated(
            Number(request.query.offset ?? defaultOffset),
            Number(request.query.limit ?? defaultLimit),
            Number(request.query.age),
            request.query.country?.toString()
        );

        return response.status(200).send(users);
    }
}
