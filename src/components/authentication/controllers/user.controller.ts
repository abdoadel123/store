import {User} from '@loopback/authentication-jwt';
import {service} from '@loopback/core';
import {api, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {LoginDto, NewUser} from '../dtos';
import {UserService} from '../services';

@api({basePath: '/api/users'})
export class UserController {
  constructor(
    @service(UserService)
    private userService: UserService,
  ) {}

  @post('/login')
  async login(
    @requestBody(LoginDto) credentials: LoginDto,
  ): Promise<{token: string}> {
    return await this.userService.login(credentials);
  }

  @post('/signup')
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUser, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUser,
  ): Promise<User> {
    return await this.userService.signUp(newUserRequest);
  }
}
