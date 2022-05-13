import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPut, request, response } from "inversify-express-utils";
import { TYPES } from "../../config/ioc/types";
import { User } from "../../entity/User";
import { IUserRepository } from "../../repository/UserRepository";
import { IUpdateUserDto, IUpdateUserService } from "../../service/user/UpdateUserService";
import { paramIdValidator } from "../../validator/paramIdValidator";
import { putUserValidator } from "../../validator/user/putUserValidator";

@controller("/users")
export class PutUserController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
    @inject(TYPES.UpdateUserService) private readonly updateUserService: IUpdateUserService;

    @httpPut("/:id", TYPES.AuthorizationMiddleware, ...paramIdValidator, ...putUserValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const user: User | null = await this.userRepository.findOneById(request.params.id);

        if (user === null) {
            return response.status(404).send({ error: `User with id: ${request.params.id} not found` });
        }

        await this.updateUserService.update(user, request.body as IUpdateUserDto);

        return response.status(200).send(user);
    }
}
