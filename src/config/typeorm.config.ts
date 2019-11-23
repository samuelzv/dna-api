import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.has('db') ? config.get('db') : {};

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: process.env.ADN_RDS_TYPE || dbConfig.type,
    host: process.env.ADN_RDS_HOSTNAME || dbConfig.host,
    port: process.env.ADN_RDS_PORT || dbConfig.port,
    database: process.env.ADN_RDS_DB_NAME || dbConfig.database,
    username: process.env.ADN_RDS_USERNAME || dbConfig.username,
    password: process.env.ADN_RDS_PASSWORD || dbConfig.password,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
};
