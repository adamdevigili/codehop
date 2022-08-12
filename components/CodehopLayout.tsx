import {
	Button,
	Container,
	Group,
	Space,
	Stack,
	TextInput,
	Text,
	AppShell,
	Header,
	MediaQuery,
	Burger,
	Navbar,
	Aside,
	Footer,
	useMantineTheme,
	Center,
	Title,
	Anchor,
	createStyles,
} from "@mantine/core";
import { useListState, useId, useClipboard } from "@mantine/hooks";
import React, { useEffect, useRef, useState } from "react";
import CodeCard, { CodeCardProps } from "./CodeCard";
import CodeCardCollection, {
	CodeCardCollectionProps,
} from "./CodeCardCollection";
import { useForm } from "@mantine/form";
import { randomUUID } from "crypto";
import { v4 } from "uuid";
import { NextApiRequest } from "next";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

export interface CodehopLayoutProps {
	codeCardProps: CodeCardProps[];
	collectionID: string;
	isSavedCollection: boolean;
}

const useStyles = createStyles((theme) => ({
	titleAnchor: {
		"&:link": {
			textDecoration: "inherit",
			color: "inherit",
			// cursor: "auto",
		},

		"&:hover": {
			textDecoration: "inherit",
			color: "inherit",
			// cursor: "auto",
		},
	},
	textPrompt: {
		fontFamily: theme.fontFamily,
	},
	chButton: {
		backgroundColor: "#0C4160",
	},
}));

export default function CodehopLayout(props: CodehopLayoutProps) {
	const [codeCardProps, codeCardPropsHandlers] = useListState<CodeCardProps>(
		[]
	);

	useEffect(() => {
		codeCardPropsHandlers.setState(props.codeCardProps);
	}, [props.codeCardProps]);

	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);
	const [savedCollectionID, setSavedCollectionID] = useState(null);
	const [savingCollection, setSavingCollection] = useState(false);
	const { classes, cx } = useStyles();
	const clipboard = useClipboard({ timeout: 500 });
	const router = useRouter();

	// useEffect(() => {
	// 	changeChartData(totalMonth);
	//   }, [totalMonth.length]);

	const urlInput = useForm({
		initialValues: {
			url: "",
		},

		validate: {
			//   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
		},
	});

	function removeCodeCard(id: string) {
		console.log(codeCardProps);
		console.log("removeCodeCard", "id", id);
		codeCardPropsHandlers.filter((item) => item.id !== id);
	}

	function addCodeCard(url: string) {
		const cardID = v4();
		console.log("url", url, "cardID", cardID);
		// const url =
		// 	"https://github.com/adamdevigili/tarkov-charts/blob/master/api/ammo.go#L10";

		const parts = url.split("#L");

		const rawURL = parts[0]
			.replace("github.com", "raw.githubusercontent.com")
			.replace("blob/", "");

		// console.log(rawURL);

		// console.log(Number(parts[1]));
		codeCardPropsHandlers.append({
			id: cardID,
			url: rawURL,
			lineNumber: Number(parts[1]),
			language: "go",
			providedURL: url,
			onRemove: removeCodeCard,
			isSavedCollection: props.isSavedCollection,
		});

		console.log(codeCardProps);
	}

	async function saveCollection() {
		setSavingCollection(true);
		const r: CodeCardCollectionProps = {
			codeCardProps: codeCardProps,
			collectionID: props.collectionID,
		};
		const req = await fetch("/api/collection", {
			method: "POST",
			body: JSON.stringify(r),
		});

		const resp = await req.json();

		clipboard.copy(resp.id);
		setSavingCollection(false);

		showNotification({
			// title: 'Default notification',
			message: "Collection ID saved to clipboard",
		});

		router.push("/" + resp.id);

		console.log(resp.id);

		// return setData(newData.results);
	}

	function addTestURL1() {
		const url =
			"https://github.com/kubernetes/kubernetes/blob/master/cmd/kube-apiserver/app/server.go#L635";

		addCodeCard(url);
	}

	function addTestURL2() {
		const url =
			"https://github.com/go-gorm/gorm/blob/master/migrator/migrator.go#L241";

		addCodeCard(url);
	}

	function addTestURL3() {
		const url =
			"https://github.com/withastro/astro/blob/main/packages/astro/astro.js#L80";

		addCodeCard(url);
	}

	function addAll() {
		addTestURL1();
		addTestURL2();
		addTestURL3();
	}

	function removeURL() {
		codeCardPropsHandlers.pop();
	}

	return (
		<div>
			<AppShell
				styles={{
					main: {
						background:
							theme.colorScheme === "dark"
								? theme.colors.dark[8]
								: theme.colors.gray[0],
					},
				}}
				navbarOffsetBreakpoint="sm"
				asideOffsetBreakpoint="sm"
				// navbar={
				// 	<Navbar
				// 		p="md"
				// 		hiddenBreakpoint="sm"
				// 		hidden={!opened}
				// 		width={{ sm: 100, lg: 200 }}
				// 	>
				// 		<Text>Application navbar</Text>
				// 	</Navbar>
				// }
				// aside={
				// 	<MediaQuery smallerThan="sm" styles={{ display: "none" }}>
				// 		<Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
				// 			<Text>Application sidebar</Text>
				// 		</Aside>
				// 	</MediaQuery>
				// }
				// footer={
				// 	<Footer height={60} p="md">
				// 		Application footer
				// 	</Footer>
				// }
				header={
					<Header height={70} p="md">
						<div
						// style={{ display: "flex", alignItems: "center", height: "100%" }}
						>
							{/* <MediaQuery largerThan="sm" styles={{ display: "none" }}>
								<Burger
									opened={opened}
									onClick={() => setOpened((o) => !o)}
									size="sm"
									color={theme.colors.gray[6]}
									mr="xl"
								/>
							</MediaQuery> */}

							<Anchor href="/" className={classes.titleAnchor}>
								<Title style={{ fontFamily: theme.fontFamily }}>Codehop</Title>
							</Anchor>
						</div>
					</Header>
				}
			>
				<Stack>
					<Container>
						{!props.isSavedCollection && (
							<Center>
								<form
									onSubmit={urlInput.onSubmit((values) => {
										addCodeCard(values.url);
										urlInput.setValues({ url: "" });
									})}
								>
									<Group>
										<TextInput
											placeholder="Link to file and line number"
											{...urlInput.getInputProps("url")}
										/>

										<Button className={classes.chButton} type="submit">
											Add
										</Button>
										{codeCardProps.length != 0 && (
											<Button
												className={classes.chButton}
												onClick={saveCollection}
												loading={savingCollection}
											>
												Share
											</Button>
										)}
									</Group>
								</form>
							</Center>
						)}

						{/* <Group>
							<Button onClick={addTestURL1}>Add Test URL 1</Button>
							<Button onClick={addTestURL2}>Add Test URL 2</Button>
							<Button onClick={addTestURL3}>Add Test URL 3</Button>
							<Button onClick={addAll}>Add All</Button>
						</Group> */}
					</Container>
					{codeCardProps.length == 0 ? (
						<Center>
							<Title className={classes.textPrompt}>
								{" "}
								Get started by submitting links{" "}
							</Title>
						</Center>
					) : (
						<CodeCardCollection
							codeCardProps={codeCardProps}
							collectionID={props.collectionID}
						/>
					)}
				</Stack>
			</AppShell>
		</div>
	);
}
