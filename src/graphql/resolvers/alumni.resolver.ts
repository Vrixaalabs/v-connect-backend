import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { AlumniVerification, IAlumniVerification } from '../../models/alumni.model';
import { User } from '../../models/user.model';
import { AlumniVerificationType } from '../types/alumni.type';
import { sendNotification } from '../../utils/sendNotification';
import { pubsub } from '../../utils/pubsub';

@Resolver(() => AlumniVerificationType)
export class AlumniResolver {
  @Authorized()
  @Query(() => [AlumniVerificationType])
  async getAlumniVerifications(@Ctx() { user }: { user: any }): Promise<IAlumniVerification[]> {
    // In a real app, you'd check if the user is an admin
    return AlumniVerification.find().populate('user').populate('verifiedBy');
  }

  @Authorized()
  @Query(() => AlumniVerificationType, { nullable: true })
  async getMyAlumniVerification(@Ctx() { user }: { user: any }): Promise<IAlumniVerification | null> {
    return AlumniVerification.findOne({ user: user.id }).populate('user').populate('verifiedBy');
  }

  @Authorized()
  @Mutation(() => AlumniVerificationType)
  async submitAlumniVerification(
    @Arg('documents', () => [String]) documents: string[],
    @Arg('graduationYear') graduationYear: number,
    @Arg('degree') degree: string,
    @Arg('department') department: string,
    @Ctx() { user }: { user: any }
  ): Promise<IAlumniVerification> {
    // Check if user already has a verification request
    const existingVerification = await AlumniVerification.findOne({ user: user.id });
    if (existingVerification) {
      throw new Error('You already have a verification request');
    }

    const verification = await AlumniVerification.create({
      user: user.id,
      documents,
      graduationYear,
      degree,
      department,
    });

    return verification.populate('user');
  }

  @Authorized()
  @Mutation(() => String)
  async approveAlumniVerification(
    @Arg('verificationId') verificationId: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    // In a real app, you'd check if the user is an admin
    const verification = await AlumniVerification.findById(verificationId).populate('user');
    
    if (!verification) {
      throw new Error('Verification not found');
    }

    if (verification.status !== 'pending') {
      throw new Error('Verification is not pending');
    }

    verification.status = 'approved';
    verification.verifiedBy = user.id;
    verification.verifiedAt = new Date();
    await verification.save();

    // Update user's alumni status
    await User.findByIdAndUpdate(verification.user.id, { isAlumni: true });

    // Send notification
    await sendNotification({
      userId: verification.user.id,
      type: 'alumni_status',
      message: 'Your alumni verification was approved.',
      link: '/alumni',
      pubsub,
    });

    return 'Alumni verification approved successfully';
  }

  @Authorized()
  @Mutation(() => String)
  async rejectAlumniVerification(
    @Arg('verificationId') verificationId: string,
    @Arg('reason') reason: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    // In a real app, you'd check if the user is an admin
    const verification = await AlumniVerification.findById(verificationId).populate('user');
    
    if (!verification) {
      throw new Error('Verification not found');
    }

    if (verification.status !== 'pending') {
      throw new Error('Verification is not pending');
    }

    verification.status = 'rejected';
    verification.reason = reason;
    verification.verifiedBy = user.id;
    verification.verifiedAt = new Date();
    await verification.save();

    // Send notification
    await sendNotification({
      userId: verification.user.id,
      type: 'alumni_status',
      message: `Your alumni verification was rejected. Reason: ${reason}`,
      link: '/alumni',
      pubsub,
    });

    return 'Alumni verification rejected successfully';
  }

  @Authorized()
  @Mutation(() => String)
  async updateAlumniVerification(
    @Arg('documents', () => [String]) documents: string[],
    @Arg('graduationYear') graduationYear: number,
    @Arg('degree') degree: string,
    @Arg('department') department: string,
    @Ctx() { user }: { user: any }
  ): Promise<string> {
    const verification = await AlumniVerification.findOne({ user: user.id });
    
    if (!verification) {
      throw new Error('No verification request found');
    }

    if (verification.status === 'approved') {
      throw new Error('Cannot update approved verification');
    }

    verification.documents = documents;
    verification.graduationYear = graduationYear;
    verification.degree = degree;
    verification.department = department;
    verification.status = 'pending';
    verification.reason = undefined;
    verification.verifiedBy = undefined;
    verification.verifiedAt = undefined;
    
    await verification.save();

    return 'Alumni verification updated successfully';
  }
} 