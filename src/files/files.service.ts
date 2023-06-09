import { Inject, Injectable } from '@nestjs/common';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

import PublicFile from './publicFile.entity';
import { DATABASE_CONNECTION } from '../shared/providers-ids';

@Injectable()
export class FilesService {
  private publicFilesRepository: Repository<PublicFile>;

  constructor(
    @Inject(DATABASE_CONNECTION) private databaseConnection: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.publicFilesRepository =
      this.databaseConnection.getRepository<PublicFile>(PublicFile);
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }

  async deletePublicFile(fileId: number) {
    const file = await this.publicFilesRepository.findOneBy({ id: fileId });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await this.publicFilesRepository.delete(fileId);
  }

  async deletePublicFileWithQueryRunner(
    fileId: number,
    queryRunner: QueryRunner,
  ) {
    const file = await queryRunner.manager.findOneBy(PublicFile, {
      id: fileId,
    });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await queryRunner.manager.delete(PublicFile, fileId);
  }
}
