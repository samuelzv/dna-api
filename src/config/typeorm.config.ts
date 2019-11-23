import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.has('db') ? config.get('db') : {};

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: process.env.RDS_TYPE || dbConfig.type,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
};
