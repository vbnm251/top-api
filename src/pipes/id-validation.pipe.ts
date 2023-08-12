import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ID_VALIDATINO_ERROR } from './id-validation.constants';

@Injectable()
export class IdValidatinoPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type != 'param') {
      return value;
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(ID_VALIDATINO_ERROR);
    }

    return value;
  }
}
