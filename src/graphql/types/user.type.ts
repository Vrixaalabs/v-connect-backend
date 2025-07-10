import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class AlumniVerificationRequestType {
  @Field()
  requested: boolean;

  @Field({ nullable: true })
  message?: string;
}

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

  @Field()
  isAlumniVerified: boolean;

  @Field({ nullable: true })
  graduationYear?: number;

  @Field({ nullable: true })
  alumniBio?: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field(() => AlumniVerificationRequestType, { nullable: true })
  alumniVerificationRequest?: AlumniVerificationRequestType;

  @Field(() => [String], { nullable: true })
  roles?: string[];

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