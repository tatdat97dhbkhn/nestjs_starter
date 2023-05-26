import { Module } from '@nestjs/common';

import CategoriesController from './categories.controller';
import CategoriesService from './categories.service';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
