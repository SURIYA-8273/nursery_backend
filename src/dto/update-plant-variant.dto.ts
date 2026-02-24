import { PartialType } from '@nestjs/mapped-types';
import { CreatePlantVariantDto } from './create-plant-variant.dto';

export class UpdatePlantVariantDto extends PartialType(CreatePlantVariantDto) {}
