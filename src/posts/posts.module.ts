import { Module } from '@nestjs/common';

import PostsController from './posts.controller';
import PostsService from './posts.service';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
