import { ObjectType, Field, ID } from 'type-graphql';
import { UserType } from './user.type';

@ObjectType()
export class CommentType {
  @Field(() => ID)
  id: string;

  @Field(() => UserType)
  author: UserType;

  @Field()
  content: string;

  @Field()
  timestamp: Date;
}

@ObjectType()
export class PostType {
  @Field(() => ID)
  id: string;

  @Field(() => UserType)
  author: UserType;

  @Field()
  content: string;

  @Field(() => [String], { nullable: true })
  media?: string[];

  @Field(() => [UserType])
  likes: UserType[];

  @Field(() => [CommentType])
  comments: CommentType[];

  @Field()
  timestamp: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
} 