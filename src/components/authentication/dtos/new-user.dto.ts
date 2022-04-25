import {User} from '@loopback/authentication-jwt';
import {model, property} from '@loopback/repository';
import {Roles} from '../../../common/enums/roles.enum';

@model()
export class NewUser extends User {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8,
    },
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(Roles),
    },
  })
  role: string;
}
