import { Module } from '@nestjs/common';
import { MutationsController } from './mutations.controller';
import { MutationsService } from './mutations.service';
import { SequencesWalkerService } from './sequences-walker.service';

@Module({
  controllers: [
      MutationsController,
  ],
  providers: [
      MutationsService,
      SequencesWalkerService,
  ],
})
export class MutationsModule {}
