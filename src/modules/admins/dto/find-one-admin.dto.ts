import { PickType } from '@nestjs/swagger';
import { FindAdminsDto } from './find-admins.dto';

export class FindOneAdminDto extends PickType(FindAdminsDto, ['includes']) {}
