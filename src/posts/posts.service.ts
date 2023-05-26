import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import Post from './post.entity';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { DATABASE_CONNECTION } from '../shared/providers-ids';
import PostNotFoundException from './exceptions /postNotFound.exception';
import User from '../users/user.entity';

@Injectable()
export default class PostsService {
  private postsRepository: Repository<Post>;

  constructor(
    @Inject(DATABASE_CONNECTION) private databaseConnection: DataSource,
  ) {
    this.postsRepository = this.databaseConnection.getRepository<Post>(Post);
  }

  getAllPosts() {
    return this.postsRepository.find({ relations: ['author'] });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user,
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (updatedPost) {
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
