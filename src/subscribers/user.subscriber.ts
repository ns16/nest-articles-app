import { hashSync } from 'bcrypt';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { User } from '../entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  afterLoad(entity: User) {
    entity.tmpPassword = entity.password;
  }

  beforeInsert(event: InsertEvent<User>) {
    if (event.entity.password !== event.entity.tmpPassword) {
      event.entity.password = hashSync(event.entity.password, 10);
    }
  }

  beforeUpdate(event: UpdateEvent<User>) {
    if (event?.entity?.password && event.entity.password !== event.entity.tmpPassword) {
      event.entity.password = hashSync(event.entity.password, 10);
    }
  }
}
