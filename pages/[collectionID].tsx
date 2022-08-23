import { useListState } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CodeCardProps } from "../components/CodeCard";
import CodehopLayout from "../components/CodehopLayout";

export default function SavedCollection() {
	const router = useRouter();
	const { collectionID } = router.query;

	const [codeCardProps, codeCardPropsHandlers] = useListState<CodeCardProps>(
		[]
	);

	useEffect(() => {
		// console.log("collectionID", collectionID);
		if (collectionID) {
			fetch(`/api/collection?collection_id=${collectionID}`)
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					// console.log("fetched", data);
					codeCardPropsHandlers.setState(data.codeCardProps.codeCardProps);
					// console.log("codeCardProps", codeCardProps);
				});
		}
	}, [collectionID]);

	return (
		<CodehopLayout
			codeCardPropsInit={codeCardProps}
			collectionID={collectionID as string}
			isSavedCollection={true}
		/>
	);
}
