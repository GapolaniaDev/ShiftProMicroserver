import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfile, CreateUserProfileInput, UpdateUserProfileInput } from './user.types';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Resolver(() => UserProfile)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => UserProfile)
  @UseGuards(JwtAuthGuard)
  async createUserProfile(@Args('input') input: CreateUserProfileInput): Promise<UserProfile> {
    return this.userService.createProfile(input);
  }

  @Query(() => UserProfile)
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Args('userId') userId: string): Promise<UserProfile> {
    return this.userService.getProfile(userId);
  }

  @Query(() => UserProfile)
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser() user: any): Promise<UserProfile> {
    console.log('=== GATEWAY: getMyProfile called ===');
    console.log('User ID from JWT:', user.sub);
    console.log('Full user object:', JSON.stringify(user, null, 2));
    
    const result = await this.userService.getProfile(user.sub);
    console.log('=== GATEWAY: getMyProfile result ===', result);
    return result;
  }

  @Mutation(() => UserProfile)
  @UseGuards(JwtAuthGuard)
  async updateUserProfile(
    @Args('userId') userId: string,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<UserProfile> {
    return this.userService.updateProfile(userId, input);
  }

  @Mutation(() => UserProfile)
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(
    @CurrentUser() user: any,
    @Args('input') input: UpdateUserProfileInput,
  ): Promise<UserProfile> {
    return this.userService.updateProfile(user.sub, input);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async deleteUserProfile(@Args('userId') userId: string): Promise<string> {
    return this.userService.deleteProfile(userId);
  }

  @Query(() => [UserProfile])
  @UseGuards(JwtAuthGuard)
  async getAllUserProfiles(): Promise<UserProfile[]> {
    return this.userService.getAllProfiles();
  }
}