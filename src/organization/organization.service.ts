import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel('Organization', 'platform')
    private orgModel: Model<any>,
  ) {}

  async create(data: { _id: string; name: string; mongoUri: string; ownerUserId: string }) {
    // 1️⃣ Aynı URI daha önce kullanılmış mı?
    const exists = await this.orgModel.findOne({ mongoUri: data.mongoUri });
    if (exists) {
      throw new BadRequestException('Bu veritabanı bağlantısı zaten başka bir organizasyon tarafından kullanılıyor.');
    }
    if (!data.mongoUri) {
      data.mongoUri = `mongodb://localhost:27017/db_${data._id}`;
    }

    // 2️⃣ Mongo URI gerçekten bağlanabilir mi?
    try {
      const conn = await mongoose.createConnection(data.mongoUri).asPromise();
      await conn.close(); // bağlantıyı test edip kapatıyoruz
    } catch (err) {
      throw new BadRequestException(
        'Belirtilen MongoDB bağlantısına erişilemiyor. Lütfen bağlantıyı kontrol edin.',
        err,
      );
    }

    // 3️⃣ Sorun yoksa organizasyonu oluştur
    try {
      return await this.orgModel.create(data);
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException('Bu veritabanı bağlantısı zaten kayıtlı.');
      }
      throw err;
    }
  }

  async findAll() {
    return this.orgModel.find();
  }

  async findById(id: string) {
    return this.orgModel.findById(id);
  }
  async findByOwner(userId: string) {
    return this.orgModel.find({ ownerUserId: userId });
  }
}
