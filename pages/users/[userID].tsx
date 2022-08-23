import { Title } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import { CodeCardProps } from "../../components/CodeCard";
import CodehopLayout from "../../components/CodehopLayout";

export default function User() {
	const router = useRouter();
	const { userID } = router.query;

	const [userData, setUserData] = useState(null);

	useEffect(() => {
		// console.log("collectionID", collectionID);
		if (userID) {
			fetch(`/api/users?user_email=${userID}`)
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					// console.log("fetched", data);
					setUserData(data);
					// console.log("codeCardProps", codeCardProps);
				});
		}
	}, [userID]);

	return (
		<>
			<Title>{JSON.stringify(userData)}</Title>
		</>
	);
}
