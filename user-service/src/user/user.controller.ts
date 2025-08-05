import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserProfileDto, UpdateUserProfileDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createProfile(@Body() createUserProfileDto: CreateUserProfileDto) {
    return this.userService.createProfile(createUserProfileDto);
  }

  @Get(':userId')
  async getProfile(@Param('userId') userId: string) {
    console.log('=== USER-SERVICE: getProfile endpoint called with userId:', userId);
    
    const result = await this.userService.findByUserId(userId);
    console.log('=== USER-SERVICE: findByUserId result:', result);
    
    return result;
  }

  @Put(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateProfile(userId, updateUserProfileDto);
  }

  @Delete(':userId')
  async deleteProfile(@Param('userId') userId: string) {
    await this.userService.deleteProfile(userId);
    return { message: 'Profile deleted successfully' };
  }

  @Get()
  async getAllProfiles() {
    return this.userService.getAllProfiles();
  }
}