import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import LocalFile from './localFile.entity';
import LocalFileDto from './dto/localFile.dto';
import { DATABASE_CONNECTION } from '../shared/providers-ids';

@Injectable()
class LocalFilesService {
  private localFilesRepository: Repository<LocalFile>;

  constructor(
    @Inject(DATABASE_CONNECTION) private databaseConnection: DataSource,
  ) {
    this.localFilesRepository =
      this.databaseConnection.getRepository<LocalFile>(LocalFile);
  }

  async saveLocalFileData(fileData: LocalFileDto) {
    const newFile = await this.localFilesRepository.create(fileData);
    await this.localFilesRepository.save(newFile);
    return newFile;
  }

  async getFileById(fileId: number) {
    const file = await this.localFilesRepository.findOneBy({ id: fileId });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}

export default LocalFilesService;
