import { ObjectType, Field, ID } from 'type-graphql';
import { UserType } from './user.type';

@ObjectType()
export class EventType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  date: Date;

  @Field()
  location: string;

  @Field(() => UserType)
  createdBy: UserType;

  @Field()
  status: string;

  @Field(() => [UserType])
  attendees: UserType[];

  @Field({ nullable: true })
  maxAttendees?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
} 