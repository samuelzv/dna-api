import {Body, Controller, ForbiddenException, HttpCode, Logger, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {CreateMutationDto} from './dto/create-mutation.dto';
import {MutationsService} from './mutations.service';
import {ApiForbiddenResponse, ApiOkResponse, ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('mutations')
@Controller('mutations')
export class MutationsController {
    private logger = new Logger('MutationsController');
    constructor(private mutationService: MutationsService) {
    }

    @Post()
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    @ApiOkResponse({ description: 'Mutation has been found.'})
    @ApiForbiddenResponse({ description: 'Not found mutation.'})
    createMutations(@Body() createMutationDto: CreateMutationDto) {
        if (this.mutationService.hasMutations(createMutationDto.dna)) {
            return { message: 'Mutation has been found' };
        }

        throw new ForbiddenException('Not found mutation');
    }

}
