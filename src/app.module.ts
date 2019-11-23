import { Module } from '@nestjs/common';
import { MutationsModule } from './mutations/mutations.module';

@Module({
  imports: [MutationsModule],
})
export class AppModule {}
