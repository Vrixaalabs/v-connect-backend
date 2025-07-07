import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';
import { UserType, AuthResponse } from '../types/user.type';

@Resolver()
export class UserResolver {
  @Query(() => [UserType])
  async users(): Promise<UserType[]> {
    return User.find();
  }

  @Query(() => UserType, { nullable: true })
  async me(@Ctx() { user }: { user: any }): Promise<UserType | null> {
    if (!user) return null;
    return user;
  }

  @Mutation(() => AuthResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<AuthResponse> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'v-connect-secret',
      { expiresIn: '1d' }
    );

    return { token, user };
  }

  @Mutation(() => AuthResponse)
  async register(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('department') department: string,
    @Arg('batch') batch: string,
    @Arg('isAlumni') isAlumni: boolean,
    @Arg('interests', () => [String]) interests: string[]
  ): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      department,
      batch,
      isAlumni,
      interests
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'v-connect-secret',
      { expiresIn: '1d' }
    );

    return { token, user };
  }

  @Authorized()
  @Mutation(() => UserType)
  async updateProfile(
    @Ctx() { user }: { user: any },
    @Arg('name', { nullable: true }) name?: string,
    @Arg('department', { nullable: true }) department?: string,
    @Arg('batch', { nullable: true }) batch?: string,
    @Arg('interests', () => [String], { nullable: true }) interests?: string[],
    @Arg('profilePicture', { nullable: true }) profilePicture?: string
  ): Promise<UserType> {
    const updates: any = {};
    if (name) updates.name = name;
    if (department) updates.department = department;
    if (batch) updates.batch = batch;
    if (interests) updates.interests = interests;
    if (profilePicture) updates.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      updates,
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }
} 