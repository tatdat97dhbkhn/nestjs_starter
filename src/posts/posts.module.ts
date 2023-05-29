import { Module } from '@nestjs/common';

import PostsController from './posts.controller';
import PostsService from './posts.service';
import { DatabaseModule } from '../database';
import { SearchModule } from '../search/search.module';
import PostsSearchService from './postsSearch.service';

@Module({
  imports: [DatabaseModule, SearchModule],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService],
})
export class PostsModule {}
