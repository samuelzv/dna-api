import { Module } from '@nestjs/common';
import { MutationsController } from './mutations.controller';
import { MutationsService } from './mutations.service';
import { MutationsResolver } from './mutations-resolver.service';
import { SequencesWalkerService } from './sequences-walker.service';

@Module({
  controllers: [
      MutationsController,
  ],
  providers: [
      MutationsResolver,
      MutationsService,
      SequencesWalkerService,
  ],
})
export class MutationsModule {}
