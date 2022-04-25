import {model, property} from '@loopback/repository';

@model()
export class LoginDto {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8,
    },
  })
  password: string;
}
