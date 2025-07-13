import { ObjectType, Field, ID } from 'type-graphql';
import { UserType } from './user.type';

@ObjectType()
export class NotificationType {
  @Field(() => ID)
  id: string;

  @Field(() => UserType)
  user: UserType;

  @Field()
  type: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  link?: string;

  @Field()
  read: boolean;

  @Field()
  timestamp: Date;
}
