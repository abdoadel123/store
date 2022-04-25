import {UserRepository} from '@loopback/authentication-jwt';
import {StoreTaskApplication} from '../../../application';
import {Roles} from '../../../common/enums/roles.enum';

export class UserHelper {
  constructor(private app: StoreTaskApplication) {}

  async findOne(id: string, role: Roles) {
    const userRepository = await this.app.getRepository(UserRepository);

    return await userRepository.findOne({
      where: {
        id,
        role,
      },
    });
  }
}
