import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, request, response } from "inversify-express-utils";
import { TYPES } from "../../config/ioc/types";
import { User } from "../../entity/User";
import { IUserRepository } from "../../repository/UserRepository";
import { IRemoveUserService } from "../../service/user/RemoveUserService";

@controller("/users")
export class DeleteUserController extends BaseHttpController {
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository;
    @inject(TYPES.RemoveUserService) private readonly removeUserService: IRemoveUserService;

    @httpDelete("/:id")
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const user: User | null = await this.userRepository.findOneById(request.params.id);

        if (user === null) {
            return response.status(404).send({ error: `User with id: ${request.params.id} not found` });
        }

        await this.removeUserService.remove(user);

        return response.status(204).send();
    }
}
