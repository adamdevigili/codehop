import { Avatar, Button, createStyles, Group, Menu } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { BrandGithub } from "tabler-icons-react";
import { v4 } from "uuid";

const useStyles = createStyles((theme) => ({
	chButton: {
		backgroundColor: theme.colors.dark[8],
	},
	dropdown: {
		backgroundColor: theme.colors.dark[6],
	},
}));

export interface UserProps {
	id: string;
	email: string;
	collectionIDs?: string[];
}

export default function Account() {
	const { data: session } = useSession();
	const { classes, cx } = useStyles();

	const [userData, setUserData] = useState(null);

	useEffect(() => {
		// console.log("collectionID", collectionID);
		if (session) {
			getUserByID();
		}
	}, [session]);

	async function addUser() {
		// setSavingCollection(true);
		const userID = v4();
		const r: UserProps = {
			id: userID,
			email: session.user.email,
		};

		const req = await fetch("/api/users", {
			method: "POST",
			body: JSON.stringify(r),
		});

		const resp = await req.json();

		// console.log(resp);

		// clipboard.copy(resp.id);
		// setSavingCollection(false);

		// showNotification({
		// 	// title: 'Default notification',
		// 	message: "Collection ID saved to clipboard",
		// });

		// router.push("/" + resp.id);

		// console.log(resp.id);

		// return setData(newData.results);
	}

	async function getUserByID() {
		fetch(`/api/users?user_email=${session.user.email}`)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				// console.log("fetched", data);
				setUserData(data);
				// console.log("codeCardProps", codeCardProps);
			});
	}

	async function getUserCollectionsByEmail() {
		// setSavingCollection(true);
		// const userID = v4();
		// const r: UserProps = {
		// 	id: userID,
		// 	email: session.user.email,
		// };
		// const req = await fetch(
		// 	`/api/collections?collection_id=${session.user.email}`,
		// 	{
		// 		method: "POST",
		// 		body: JSON.stringify(r),
		// 	}
		// );
		// const resp = await req.json();
		// console.log(resp);
		// clipboard.copy(resp.id);
		// setSavingCollection(false);
		// showNotification({
		// 	// title: 'Default notification',
		// 	message: "Collection ID saved to clipboard",
		// });
		// router.push("/" + resp.id);
		// console.log(resp.id);
		// return setData(newData.results);
	}

	if (session) {
		// console.log(session);
		return (
			<Menu shadow="md" width={200} classNames={classes}>
				<Menu.Target>
					<Avatar src={session.user.image} />
				</Menu.Target>

				<Menu.Dropdown>
					{/* <Menu.Label>Account</Menu.Label>
					<Menu.Item onClick={() => signOut()}>My collections</Menu.Item>
					<Menu.Divider /> */}
					<Menu.Item color="red" onClick={() => signOut()}>
						Sign out
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		);
	}
	return (
		<>
			<Button
				className={classes.chButton}
				leftIcon={<BrandGithub />}
				onClick={() => signIn()}
			>
				Sign in
			</Button>
		</>
	);
}
