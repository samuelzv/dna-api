import {Module} from '@nestjs/common';
import {MutationsModule} from './mutations/mutations.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {typeOrmConfig} from './config/typeorm.config';
import { AppController } from './app.controller';

@Module({
  imports: [
      TypeOrmModule.forRoot(typeOrmConfig),
      MutationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
