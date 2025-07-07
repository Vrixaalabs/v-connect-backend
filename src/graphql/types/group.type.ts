import { ObjectType, Field, ID } from 'type-graphql';
import { UserType } from './user.type';
import { GraphQLISODateTime } from 'type-graphql';

@ObjectType()
export class GroupMessageType {
  @Field(() => ID)
  id: string;

  @Field(() => UserType)
  sender: UserType;

  @Field()
  content: string;

  // We'll use the auto-generated createdAt from Mongoose for the timestamp
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
}

@ObjectType()
export class GroupType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  isOfficial: boolean;

  @Field()
  chatMode: string;

  @Field(() => [UserType])
  members: UserType[];

  @Field(() => [UserType])
  admins: UserType[];

  @Field(() => [UserType])
  requests: UserType[];
  
  @Field({ nullable: true })
  description?: string;
}