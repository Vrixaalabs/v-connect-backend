import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  department: string;

  @Field()
  batch: string;

  @Field(() => [String])
  interests: string[];

  @Field()
  isAlumni: boolean;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field(() => [UserType])
  friends: UserType[];

  @Field(() => [UserType])
  friendRequests: UserType[];

  @Field(() => [UserType])
  sentFriendRequests: UserType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => UserType)
  user: UserType;
} 