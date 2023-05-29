import { Express } from 'express';

class FileUploadDto {
  file: Express.Multer.File;
}

export default FileUploadDto;
