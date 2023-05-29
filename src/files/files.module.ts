import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
