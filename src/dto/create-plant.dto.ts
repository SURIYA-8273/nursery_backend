import { IsString, IsOptional, IsBoolean, IsArray, IsNotEmpty, IsNumber, IsInt, ValidateNested, ArrayMinSize, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class VariantInput {
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  ratings?: number;

  @IsInt()
  @IsOptional()
  reviewsCount?: number;

  @IsString()
  @IsOptional()
  growthRate?: string;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsInt()
  @IsOptional()
  quantityInStock?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  coverImages?: string[];
}

export class CreatePlantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  tamilName?: string;

  @IsString()
  @IsOptional()
  subName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  baseImageUrl?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  careInfo?: string;

  @IsString()
  @IsOptional()
  fertilizingInfo?: string;

  @IsString()
  @IsOptional()
  usageInfo?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  relatedPlantsIds?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantInput)
  @ArrayMinSize(1)
  @IsOptional()
  variants?: VariantInput[];
}
