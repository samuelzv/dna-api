import {Body, Controller, Logger, Post} from '@nestjs/common';
import {CreateMutationDto} from './dto/create-mutation.dto';
import {MutationsService} from './mutations.service';

@Controller('mutations')
export class MutationsController {
    private logger = new Logger('MutationsController');
    constructor(private mutationService: MutationsService) {
    }

    @Post()
    createMutations(@Body() createMutationDto: CreateMutationDto) {
        return this.mutationService.hasMutations(createMutationDto.dna);
    }

}
