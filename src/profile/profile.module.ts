import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { FolowEntity } from '@app/profile/folow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FolowEntity])],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
