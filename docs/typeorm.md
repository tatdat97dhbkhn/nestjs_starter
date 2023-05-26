## TypeORM

To interact with Database we use [TypeORM](https://typeorm.io/) as [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping).

In TypeORM you can use both the Active Record and the Data Mapper patterns.

Our choice is [Data Mapper](https://typeorm.io/active-record-data-mapper#what-is-the-data-mapper-pattern).

There is an official [@nestjs/typeorm](https://docs.nestjs.com/techniques/database) npm package but we don't use it in the project
since the package is locked to old version of TypeORM. Instead, we use custom [database module](../src/database) with
the latest version of TypeORM.
