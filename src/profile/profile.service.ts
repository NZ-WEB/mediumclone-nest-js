import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { ProfileEntity } from '@app/profile/profile.entity';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProfileType } from '@app/profile/types/profile.type';
import { UserType } from '@app/user/types/user.types';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getProfile(
    username: string,
    currentUserId: number,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new HttpException('Profile is not found', HttpStatus.NOT_FOUND);
    }

    return { ...user, following: false };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return {
      profile,
    };
  }
}
