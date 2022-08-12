import { CodeCardCollectionProps } from "../../components/CodeCardCollection";
import { connectToDatabase } from "../../util/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export interface SaveCollectionResponse {
	id: string;
}

export default async function saveCollection(
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
	} else {
		res.json({ error: "unsupported method" });
	}
}
