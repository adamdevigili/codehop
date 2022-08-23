import { UserProps } from "../../components/Account";
import { connectToDatabase } from "../../util/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export interface ErrorResponse {
	error: string;
	code: number;
}

export default async function users(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const user = req.body;

		// const collection = {
		// 	test: "test-insert",
		// };
		// console.log(collection);

		const parsed = JSON.parse(user);
		parsed["_id"] = parsed.id;
		// console.log(parsed);
		const { db } = await connectToDatabase();

		// const movies = await db
		// 	.collection("movies")
		// 	.find({})
		// 	.sort({ metacritic: -1 })
		// 	.limit(20)
		// 	.toArray();

		const result = await db.collection("users").insertOne(parsed);
		// console.log(`A document was inserted with the _id: ${result.insertedId}`);

		const resp: UserProps = {
			id: result.insertedId,
			email: result.email,
			collectionIDs: [],
		};

		res.json(resp);
	} else if (req.method === "GET") {
		if (req.query.user_id) {
			const userID = req.query.user_id as string;

			// const collection = {
			// 	test: "test-insert",
			// };
			console.log("API: fetching " + userID);

			const { db } = await connectToDatabase();

			const userInfo = await db.collection("users").findOne({ _id: userID });
			// if ((await cursor.count()) === 0) {
			// 	console.warn("no documents found for user", ownerID);
			// }

			// const allCollections = await cursor.toArray();

			console.log("API: fetched", userInfo);

			// const result = await db
			// 	.collection("savedCollections")
			// 	.insertOne(JSON.parse(collection));
			// console.log(`A document was inserted with the _id: ${result.insertedId}`);

			const resp: UserProps = {
				id: userInfo.id,
				email: userInfo.email,
				collectionIDs: userInfo.collectionIDs,
			};

			console.log("resp", resp);

			res.json(resp);
		}
		if (req.query.user_email) {
			const userEmail = req.query.user_email as string;

			// const collection = {
			// 	test: "test-insert",
			// };
			console.log("API: fetching " + userEmail);

			const { db } = await connectToDatabase();

			const userInfo = await db
				.collection("users")
				.findOne({ email: userEmail });
			// if ((await cursor.count()) === 0) {
			// 	console.warn("no documents found for user", ownerID);
			// }

			// const allCollections = await cursor.toArray();

			console.log("API: fetched", userInfo);

			// const result = await db
			// 	.collection("savedCollections")
			// 	.insertOne(JSON.parse(collection));
			// console.log(`A document was inserted with the _id: ${result.insertedId}`);

			if (!userInfo) {
				const e: ErrorResponse = {
					error: `user with email ${userEmail} does not exist`,
					code: 404,
				};
				res.status(404);
				res.json(e);
				return;
			}

			const resp: UserProps = {
				id: userInfo.id,
				email: userInfo.email,
				collectionIDs: userInfo.collectionIDs,
			};

			console.log("resp", resp);

			res.json(resp);
		}
	} else {
		res.json({ error: "unsupported method" });
	}
}
