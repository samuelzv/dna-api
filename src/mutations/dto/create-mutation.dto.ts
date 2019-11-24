/**
 * Data Transfer Object used by creating mutations
 */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateMutationDto {
    @ApiModelProperty({
        description: 'Array of strings containing dna sequences',
        example: ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"],
    })
    @IsNotEmpty()
    @IsArray()
    dna: string[];
}
