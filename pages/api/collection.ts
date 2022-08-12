import { CodeCardCollectionProps } from "../../components/CodeCardCollection";
import { connectToDatabase } from "../../util/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export interface SaveCollectionResponse {
	id: string;
}

export default async function collection(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const collection = req.body;

		// const collection = {
		// 	test: "test-insert",
		// };
		console.log(collection);

		const { db } = await connectToDatabase();

		// const movies = await db
		// 	.collection("movies")
		// 	.find({})
		// 	.sort({ metacritic: -1 })
		// 	.limit(20)
		// 	.toArray();

		const result = await db
			.collection("savedCollections")
			.insertOne(JSON.parse(collection));
		console.log(`A document was inserted with the _id: ${result.insertedId}`);

		const resp: SaveCollectionResponse = {
			id: result.insertedId,
		};

		res.json(resp);
	} else if (req.method === "GET") {
		const collectionID = req.query.collection_id as string;

		// const collection = {
		// 	test: "test-insert",
		// };
		console.log("fetching " + collectionID);

		const { db } = await connectToDatabase();

		const savedCodeCardProps = await db
			.collection("savedCollections")
			.findOne({ _id: new ObjectId(collectionID) });

		console.log(savedCodeCardProps);

		// const result = await db
		// 	.collection("savedCollections")
		// 	.insertOne(JSON.parse(collection));
		// console.log(`A document was inserted with the _id: ${result.insertedId}`);

		const resp: CodeCardCollectionProps = {
			codeCardProps: savedCodeCardProps,
			collectionID: collectionID,
		};

		res.json(resp);
	} else {
		res.json({ error: "unsupported method" });
	}
}
