import { MongoClient } from "mongodb";

export function getMongoClient() {
	const cs = process.env.MONGO_CS;
	if (!cs) {
		throw new Error(
			'MONGO_CS environment variable is not set. Add MONGO_CS to your .env.local with the MongoDB connection string.'
		);
	}
	return new MongoClient(cs);
}
