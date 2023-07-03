import { PickType } from '@nestjs/mapped-types';
import { FindAdminsDto } from './find-admins.dto';

export class FindOneAdminDto extends PickType(FindAdminsDto, ['includes']) {}
