import { Button, createStyles } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";
import { BrandGithub } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
	chButton: {
		backgroundColor: theme.colors.dark[8],
	},
}));

export default function LoginButton() {
	const { data: session } = useSession();
	const { classes, cx } = useStyles();

	if (session) {
		return (
			<>
				{/* Signed in as {session.user.email} <br /> */}
				{/* <Button onClick={() => getToken()}>Get token</Button> */}
				<Button className={classes.chButton} onClick={() => signOut()}>
					Sign out
				</Button>
				{/* Session: {JSON.stringify(session)} <br /> */}
			</>
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
			{/* <BrandGithub /> */}
		</>
	);
}
