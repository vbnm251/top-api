import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Delete,
  Patch,
  HttpCode,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-poduct.dto';
import { ProductService } from './product.service';
import { PRODUCT_NOT_FOUND } from './product.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidatinoPipe } from 'src/pipes/id-validation.pipe';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('byId/:id')
  async get(@Param('id', IdValidatinoPipe) id: string) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidatinoPipe) id: string) {
    const deletedProduct = await this.productService.deleteById(id);
    if (!deletedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(
    @Param('id', IdValidatinoPipe) id: string,
    @Body() dto: CreateProductDto,
  ) {
    const updatedProduct = await this.productService.updateById(id, dto);
    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    return updatedProduct;
  }

  @Get('find')
  async find(
    @Query('category') category: string,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.productService.findWithReviews(category, limit);
  }
}
