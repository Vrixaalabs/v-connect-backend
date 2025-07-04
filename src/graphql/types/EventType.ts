import { ObjectType, Field, ID } from "type-graphql";
import { UserType } from "./user.type";
import { User } from "../../models/user.model";
@ObjectType()
export class EventType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  date: Date;

  @Field()
  time: string;

  @Field()
  location: string;

  @Field({ nullable: true })
  coverImage?: string;

  @Field()
  createdBy: string; // or a UserType if you want to nest

  @Field(() => [UserType])
  organizers: UserType[]; // or [UserType] if you want to nest

  @Field(() => [String])
  departments: string[];

  @Field(() => [UserType])
  attendees: UserType[];


  @Field()
  isApproved: boolean;
}