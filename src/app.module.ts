import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MutationsModule } from './mutations/mutations.module';

@Module({
  imports: [MutationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
