import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreatePlantVariantDto {
  @IsString()
  @IsNotEmpty()
  plantId: string;

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
