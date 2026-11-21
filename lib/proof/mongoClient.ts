import { MongoClient, type Db } from "mongodb";

const globalForMongo = globalThis as unknown as {
  _provlMongoClient?: MongoClient;
  _provlMongoReachable?: boolean | null;
};

let warnedUnreachable = false;

function mongoUri(): string | null {
  const uri = process.env.MONGODB_URI?.trim();
  return uri || null;
}

export function isMongoConfigured(): boolean {
  return Boolean(mongoUri());
}

/**
 * Returns a connected Db when MONGODB_URI is set and the cluster is reachable.
 * Never throws; returns null on misconfiguration or network failure.
 */
export async function getMongoDb(): Promise<Db | null> {
  const uri = mongoUri();
  if (!uri) return null;

  if (globalForMongo._provlMongoReachable === false) {
    return null;
  }

  try {
    if (!globalForMongo._provlMongoClient) {
      globalForMongo._provlMongoClient = new MongoClient(uri, {
        serverSelectionTimeoutMS: 4_000,
        connectTimeoutMS: 4_000,
      });
    }
    const client = globalForMongo._provlMongoClient;
    const db = client.db(process.env.MONGODB_DB?.trim() || "provl");
    await db.command({ ping: 1 });
    globalForMongo._provlMongoReachable = true;
    return db;
  } catch {
    globalForMongo._provlMongoReachable = false;
    if (!warnedUnreachable) {
      warnedUnreachable = true;
      console.warn(
        "[provl] MongoDB unreachable; using file history store for this process.",
      );
    }
    return null;
  }
}