import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenServiceBindings, TokenServiceConstants} from '../constants';

export class AppAuthenticationStrategy implements AuthenticationStrategy {
  name: string = TokenServiceConstants.TOKEN_SERVICE_NAME;

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE, {optional: true})
    public tokenService: TokenService,
  ) {}

  async authenticate(request: any): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    if (!token) {
      return undefined;
    }

    const userProfile = {} as any;
    const userInfo = await this.tokenService.verifyToken(token);
    if (userInfo) {
      userProfile.name = userInfo.name;
      userProfile.username = userInfo.username;
      userProfile.role = userInfo.role;
      userProfile.token = token;
      userProfile.id = userInfo.id;
    } else {
      return undefined;
    }
    return userProfile;
  }

  extractCredentials(request: Request): string {
    if (request.headers.authorization) {
      return request.headers.authorization;
    }

    if (request.query.access_token)
      return request.query.access_token.toString();

    throw new HttpErrors.Unauthorized(`Authorization header not found.`);
  }
}
