import { ObjectType, Field, ID } from 'type-graphql';
import { UserType } from './user.type';

@ObjectType()
export class AlumniVerificationType {
  @Field(() => ID)
  id: string;

  @Field(() => UserType)
  user: UserType;

  @Field()
  status: string;

  @Field(() => [String])
  documents: string[];

  @Field()
  graduationYear: number;

  @Field()
  degree: string;

  @Field()
  department: string;

  @Field({ nullable: true })
  reason?: string;

  @Field(() => UserType, { nullable: true })
  verifiedBy?: UserType;

  @Field({ nullable: true })
  verifiedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
} 