import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';

export class AuthorizationProvider implements Provider<Authorizer> {
  value(): Authorizer {
    return this.authorize.bind(this);
  }
  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    const userdata = context.principals[0];
    const userRole = userdata.role;
    const requestAllowedRoles = metadata.allowedRoles;
    let userHaveAllowedRole = false;
    if (userRole) {
      const exists =
        requestAllowedRoles && requestAllowedRoles.includes(userRole);
      if (exists == true) {
        userHaveAllowedRole = true;
      }
    }
    if (userHaveAllowedRole) {
      return AuthorizationDecision.ALLOW;
    }
    return AuthorizationDecision.DENY;
  }
}
