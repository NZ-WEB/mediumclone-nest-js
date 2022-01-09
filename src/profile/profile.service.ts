import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { ProfileEntity } from '@app/profile/profile.entity';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProfileType } from '@app/profile/types/profile.type';
import { FolowEntity } from '@app/profile/folow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FolowEntity)
    private readonly followRepository: Repository<FolowEntity>,
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

  async followProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: profileUsername,
    });

    if (!user) {
      throw new HttpException('Profile is not found', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and following can`t be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });

    if (!follow) {
      const followToCreate = new FolowEntity();
      followToCreate.followingId = user.id;
      followToCreate.followerId = currentUserId;
      await this.followRepository.save(followToCreate);
    }

    return { ...user, following: true };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return {
      profile,
    };
  }
}
