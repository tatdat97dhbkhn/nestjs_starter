import { Module } from '@nestjs/common';
import UsersService from './users.service';
import { DatabaseModule } from '../database';
import { LocalFilesModule } from '../localFiles/localFiles.module';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, LocalFilesModule, ConfigModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
