import { inject } from "inversify";
import { TYPES } from "../../config/ioc/types";
import { User } from "../../entity/User";
import { IUserRepository } from "../../repository/UserRepository";
import { provideSingleton } from "../../utils/inversify/CustomProviders";

export interface IRemoveUserService {
    remove(user: User): Promise<void>;
}

@provideSingleton(TYPES.RemoveUserService)
export class RemoveUserService implements IRemoveUserService {
    constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}

    public async remove(user: User): Promise<void> {
        await this.userRepository.remove(user);
    }
}
