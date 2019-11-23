import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MutationsController} from './mutations.controller';
import {MutationsService} from './mutations.service';
import {MutationRepository} from './mutation.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([MutationRepository]),
    ],
    controllers: [
        MutationsController,
    ],
    providers: [
        MutationsService,
    ],
})
export class MutationsModule {}
