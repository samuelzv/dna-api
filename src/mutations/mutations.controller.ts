import {Body, Controller, ForbiddenException, HttpCode, Logger, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {CreateMutationDto} from './dto/create-mutation.dto';
import {MutationsService} from './mutations.service';
import {ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiUseTags} from '@nestjs/swagger';

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
    @ApiOperation({description: 'Mutation found returns 200 status code, otherwise returns 403 forbidden status' , title: 'Detects mutations over a DNA sequence sent as an array of string'})
    createMutations(@Body() createMutationDto: CreateMutationDto) {
        if (this.mutationService.hasMutations(createMutationDto.dna)) {
            return { message: 'Mutation has been found' };
        }

        throw new ForbiddenException('Not found mutation');
    }

}
