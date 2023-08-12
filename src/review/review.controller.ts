import {
  Post,
  Body,
  Delete,
  Param,
  Get,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidatinoPipe } from 'src/pipes/id-validation.pipe';
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService : TelegramService
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    const message = `Имя ${dto.name}\n`
    + `Заголовок ${dto.title}\n`
    + `Описание ${dto.description}\n`
    + `Рейтинг ${dto.raiting}\n`
    + `id продукта ${dto.productId}`;
    this.telegramService.sendMessage(message)
    return this.reviewService.create(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', IdValidatinoPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidatinoPipe) productId: string) {
    return this.reviewService.findByProductId(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('byProduct/:productId')
  async deleteByProduct(
    @Param('productId', IdValidatinoPipe) productId: string,
  ) {
    return this.reviewService.deleteByProductId(productId);
  }
}
