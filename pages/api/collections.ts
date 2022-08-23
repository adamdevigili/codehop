import { CodeCardCollectionProps } from "../../components/CodeCardCollection";
import { connectToDatabase } from "../../util/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export interface SaveCollectionResponse {
	id: string;
}

export default async function collections(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const collection = req.body;

		// const collection = {
		// 	test: "test-insert",
		// };
		// console.log(collection);

		const parsed = JSON.parse(collection);
		parsed.codeCardProps.forEach((element) => {
			element.isSavedCollection = true;
		});
		parsed["_id"] = parsed.collectionID;
		// console.log(parsed);
		const { db } = await connectToDatabase();

		// const movies = await db
		// 	.collection("movies")
		// 	.find({})
		// 	.sort({ metacritic: -1 })
		// 	.limit(20)
		// 	.toArray();

		const result = await db.collection("savedCollections").insertOne(parsed);
		// console.log(`A document was inserted with the _id: ${result.insertedId}`);

		const resp: SaveCollectionResponse = {
			id: result.insertedId,
		};

		res.json(resp);
	} else if (req.method === "GET") {
		if (req.query.collection_id) {
			const collectionID = req.query.collection_id as string;

			// const collection = {
			// 	test: "test-insert",
			// };
			console.log("API: fetching " + collectionID);

			const { db } = await connectToDatabase();

			const savedCodeCardProps = await db
				.collection("savedCollections")
				.findOne({ _id: collectionID });

			console.log("API: fetched", savedCodeCardProps);

			// const result = await db
			// 	.collection("savedCollections")
			// 	.insertOne(JSON.parse(collection));
			// console.log(`A document was inserted with the _id: ${result.insertedId}`);

			const resp: CodeCardCollectionProps = {
				codeCardProps: savedCodeCardProps,
				collectionID: collectionID,
				owner: savedCodeCardProps.owner,
			};

			console.log(resp);

			res.json(resp);
		} else if (req.query.user_email) {
			const userEmail = req.query.user_email as string;

			// const collection = {
			// 	test: "test-insert",
			// };
			console.log("API: fetching " + userEmail);

			const { db } = await connectToDatabase();

			const cursor = await db
				.collection("savedCollections")
				.find({ owner: userEmail });
			// if ((await cursor.count()) === 0) {
			// 	console.warn("no documents found for user", ownerID);
			// }

			const allCollections = await cursor.toArray();

			console.log("API: fetched", allCollections);

			// const result = await db
			// 	.collection("savedCollections")
			// 	.insertOne(JSON.parse(collection));
			// console.log(`A document was inserted with the _id: ${result.insertedId}`);

			// const resp: CodeCardCollectionProps = {
			// 	codeCardProps: savedCodeCardProps,
			// 	collectionID: collectionID,
			// 	owner: savedCodeCardProps.owner,
			// };

			// console.log(resp);

			res.json(allCollections);
		}
	} else {
		res.json({ error: "unsupported method" });
	}
}
