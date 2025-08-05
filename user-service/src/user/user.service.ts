import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserProfileDto, UpdateUserProfileDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createProfile(createUserProfileDto: CreateUserProfileDto): Promise<User> {
    const createdUser = new this.userModel(createUserProfileDto);
    return createdUser.save();
  }

  async findByUserId(userId: string): Promise<User> {
    console.log('=== USER-SERVICE: findByUserId searching for userId:', userId);
    
    const user = await this.userModel.findOne({ userId }).exec();
    console.log('=== USER-SERVICE: findByUserId found user:', user);
    
    if (!user) {
      console.log('=== USER-SERVICE: User not found, throwing NotFoundException');
      throw new NotFoundException('User profile not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { userId },
        { ...updateUserProfileDto, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User profile not found');
    }

    return updatedUser;
  }

  async deleteProfile(userId: string): Promise<void> {
    const result = await this.userModel.deleteOne({ userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User profile not found');
    }
  }

  async getAllProfiles(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}