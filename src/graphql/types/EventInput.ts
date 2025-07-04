import { InputType, Field } from "type-graphql";

@InputType()
export class EventInput {
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

  @Field(() => [String])
  departments: string[];

  @Field(() => [String])
  organizers: string[];
}