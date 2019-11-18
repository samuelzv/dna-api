import { Module } from '@nestjs/common';
import { MutationsController } from './mutations.controller';
import { MutationsService } from './mutations.service';

@Module({
  controllers: [MutationsController],
  providers: [MutationsService]
})
export class MutationsModule {}
