import { IsString, IsNumber, IsMongoId } from 'class-validator';
export class UpdateproductDto {
  @IsString()
  name?: string;
  @IsNumber()
  price?: number;
  @IsString()
  description?: string;
  @IsString()
  category?: string;
  @IsMongoId()
  createdBy?: string;
}
