import { Avatar, Button, createStyles, Group, Menu } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";
import { BrandGithub } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
	chButton: {
		backgroundColor: theme.colors.dark[8],
	},
	dropdown: {
		backgroundColor: theme.colors.dark[6],
	},
}));

export default function Account() {
	const { data: session } = useSession();
	const { classes, cx } = useStyles();

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
