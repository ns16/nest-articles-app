import { hashSync } from 'bcrypt';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

import { Admin } from '../entities/admin.entity';

@EventSubscriber()
export class AdminSubscriber implements EntitySubscriberInterface<Admin> {
  listenTo() {
    return Admin;
  }

  afterLoad(entity: Admin) {
    entity.tmpPassword = entity.password;
  }

  beforeInsert(event: InsertEvent<Admin>) {
    if (event.entity.password !== event.entity.tmpPassword) {
      event.entity.password = hashSync(event.entity.password, 10);
    }
  }

  beforeUpdate(event: UpdateEvent<Admin>) {
    if (event?.entity?.password && event.entity.password !== event.entity.tmpPassword) {
      event.entity.password = hashSync(event.entity.password, 10);
    }
  }
}
