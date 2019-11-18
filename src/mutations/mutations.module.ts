import { Module } from '@nestjs/common';
import { MutationsController } from './mutations.controller';
import { MutationsService } from './mutations.service';
import {MutationsResolver} from './mutations-resolver.service';

@Module({
  controllers: [
      MutationsController,
  ],
  providers: [
      MutationsResolver,
      MutationsService,
  ],
})
export class MutationsModule {}
