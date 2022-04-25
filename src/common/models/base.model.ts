import {Entity, model, property} from '@loopback/repository';

@model()
export class Base extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt: Date;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updatedAt: Date;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  constructor(data?: Partial<Base>) {
    super(data);
  }
}

export interface BaseRelations {}

export type BaseWithRelations = Base & BaseRelations;
