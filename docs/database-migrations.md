## Database migrations

For database migrations we use [TypeORM Migrations](https://typeorm.io/#/migrations). 

All migrations are stored in [migrations](../migrations) dir.
TypeORM configuration is defined in [ormconfig.ts](../ormconfig.ts).
DB credentials are taken from env variables or .env file.


During `ozu-api` deployment to k8s clusters database migrations are applied automatically.
For details look at https://github.com/blank-network/ops-kubeconfig/blob/master/services/blank-viewer-api-v2/base/blank-viewer-api-v2-db-migrations-job.yaml#L22 &
https://github.com/blank-network/ops-kubeconfig/blob/master/services/blank-viewer-api-v2/base/blank-viewer-api-v2-deployment.yaml#L25

There are several NPM scripts that should help you to work with TypeORM:

- To create a new migration you have to use `npm run db:create migrations/$NAME` where `$NAME` is the name that you would like to define for migration.
  The command will create a new migration file in [migrations](../migrations) dir. The migration file has two methods `up` and `down`.
  Method `up` should be responsible for applying changes to the database.
  Method `down` should be responsible for rolling back the changes introduced by `up` method.
  Both methods should be implemented.

- To apply the migration that was created on previous step you have to use `npm run db:migrate`.

- To rollback the last applied migration you have to use `npm run db:revert`

