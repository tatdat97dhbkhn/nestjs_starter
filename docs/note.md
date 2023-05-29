### Elastic search
- By default, the password for Elasticsearch is  changeme, The default username is “elastic“
  You might run into an issue when doing the above: es01 exited with code 78. There is a high chance that increasing the  vm.max_map_count will help, as described [here](https://stackoverflow.com/questions/56937171/efk-elasticsearch-1-exited-with-code-78-when-install-elasticsearch).

### Transaction
```ruby
async deleteAvatar(userId: number) {
  const queryRunner = this.connection.createQueryRunner();
 
  const user = await this.getById(userId);
  const fileId = user.avatar?.id;
  if (fileId) {
    await queryRunner.connect();
    await queryRunner.startTransaction();
 
    try {
      await queryRunner.manager.update(User, userId, {
        ...user,
        avatar: null
      });
      await this.filesService.deletePublicFile(fileId);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
```
With QueryRunner, we get full control over the transaction

Vẫn còn một vấn đề nhỏ với đoạn mã trên. Thật không may, filesService.deletePublicFile không sử dụng queryRunner mà chúng tôi đã khởi tạo. Điều này có thể tạo ra kết quả không mong muốn, chẳng hạn như:

`ERROR: update or delete on table “public_file” violates foreign key constraint “FK_58f5c71eaab331645112cf8cfa5” on table “user”
DETAIL: Key (id)=(12) is still referenced from table “user”.`

Giải pháp đơn giản nhất là truyền queryRunner cho phương thức filesService.deletePublicFile.

