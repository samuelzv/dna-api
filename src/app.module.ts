import {Module} from '@nestjs/common';
import {MutationsModule} from './mutations/mutations.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {typeOrmConfig} from './config/typeorm.config';

@Module({
  imports: [
      TypeOrmModule.forRoot(typeOrmConfig),
      MutationsModule,
  ],
})
export class AppModule {}
