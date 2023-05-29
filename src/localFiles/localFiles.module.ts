import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import LocalFilesService from './localFiles.service';
import LocalFilesController from './localFiles.controller';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [LocalFilesService],
  exports: [LocalFilesService],
  controllers: [LocalFilesController],
})
export class LocalFilesModule {}
