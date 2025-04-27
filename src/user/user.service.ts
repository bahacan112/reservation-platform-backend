import { Injectable } from '@nestjs/common';
import { UserSchema } from './user.schema';
import { getOrgDbConnection } from '../tenant/tenant-db.service';

@Injectable()
export class UserService {
  async getModel(orgId: string) {
    const conn = await getOrgDbConnection(orgId);
    return conn.models.User || conn.model('User', UserSchema);
  }

  async findAll(orgId: string) {
    const User = await this.getModel(orgId);
    return User.find();
  }

  async create(orgId: string, data: any) {
    const User = await this.getModel(orgId);
    return User.create({ ...data, organizationId: orgId });
  }
  async findByOrganization(organizationId: string) {
    const model = await this.getModel(organizationId);
    return model.find({ organizationId }); // sadece orgId ile eşleşen tüm kullanıcılar
  }
}
