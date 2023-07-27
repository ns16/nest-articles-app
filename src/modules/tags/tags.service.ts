import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { Tag } from '../../entities/tag.entity';

@Injectable()
export class TagsService extends BaseService(Tag) {}
