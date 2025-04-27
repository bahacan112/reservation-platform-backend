import mongoose, { Connection } from 'mongoose';
import { Schema } from 'mongoose';

interface OrganizationDoc {
  _id: string;
  name: string;
  mongoUri: string; // artık zorunlu
}

const connections: Record<string, Connection> = {};

const platformUri = 'mongodb://localhost:27017/platform';

export async function preloadAllConnections() {
  const platformConn = await mongoose.createConnection(platformUri).asPromise();
  const OrgModel = platformConn.model<OrganizationDoc>(
    'Organization',
    new Schema({
      _id: String,
      name: String,
      mongoUri: String, // artık kesin olmalı
    }),
  );

  const orgs = await OrgModel.find();
  for (const org of orgs) {
    const conn = await mongoose.createConnection(org.mongoUri).asPromise();
    connections[org._id] = conn;
    console.log(`✔️ ${org._id} bağlantısı  preload edildi: ${org.mongoUri}`);
  }
}

export async function getOrgDbConnection(orgId: string): Promise<Connection> {
  if (connections[orgId]) return connections[orgId];

  console.log(`⚠️ ${orgId} için preload yok, dinamik bağlantı kuruluyor...`);
  const platformConn = await mongoose.createConnection(platformUri).asPromise();
  const OrgModel = platformConn.model<OrganizationDoc>(
    'Organization',
    new Schema({
      _id: String,
      name: String,
      mongoUri: String,
    }),
  );

  const org = await OrgModel.findOne({ _id: orgId });
  if (!org || !org.mongoUri) throw new Error(`Organization '${orgId}' not found or missing mongoUri`);

  const conn = await mongoose.createConnection(org.mongoUri).asPromise();
  connections[org._id] = conn;

  console.log(`✅ ${org._id} bağlantısı dinamik olarak açıldı: ${org.mongoUri}`);
  return conn;
}
