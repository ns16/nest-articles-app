import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { Content } from '../../entities/content.entity';

@Injectable()
export class ContentsService extends BaseService(Content) {}
