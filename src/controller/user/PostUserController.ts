import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpPost, request, response } from "inversify-express-utils";
import { TYPES } from "../../config/ioc/types";
import { User } from "../../entity/User";
import { ICreateUserDto, ICreateUserService } from "../../service/user/CreateUserService";
import { postUserValidator } from "../../validator/user/postUserValidator";

@controller("/users")
export class PostUserController extends BaseHttpController {
    @inject(TYPES.CreateUserService) private readonly createUserService: ICreateUserService;

    @httpPost("/", TYPES.AuthorizationMiddleware, ...postUserValidator)
    public async index(@request() request: Request, @response() response: Response): Promise<Response> {
        const user: User = await this.createUserService.create(request.body as ICreateUserDto);

        return response.status(201).send(user);
    }
}
