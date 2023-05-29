import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import User from './user.entity';
import { DATABASE_CONNECTION } from '../shared/providers-ids';
import { UserParamsDto } from './dto/userParams.dto';
import LocalFileDto from '../localFiles/dto/localFile.dto';
import LocalFilesService from '../localFiles/localFiles.service';

@Injectable()
export default class UsersService {
  private usersRepository: Repository<User>;

  constructor(
    @Inject(DATABASE_CONNECTION) private databaseConnection: DataSource,
    private localFilesService: LocalFilesService,
  ) {
    this.usersRepository = this.databaseConnection.getRepository<User>(User);
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email: email });

    if (user) return user;
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: UserParamsDto) {
    const user = await this.usersRepository.create(userData);
    await this.usersRepository.save(user);

    return user;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async addAvatar(userId: number, fileData: LocalFileDto) {
    const avatar = await this.localFilesService.saveLocalFileData(fileData);
    await this.usersRepository.update(
      {
        id: userId,
      },
      {
        avatar: avatar,
      },
    );
  }
}
