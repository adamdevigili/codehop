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
	HoverCard,
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
import LoginButton from "./LoginButton";
import { useSession } from "next-auth/react";

export interface CodehopLayoutProps {
	codeCardProps: CodeCardProps[];
	collectionID: string;
	isSavedCollection: boolean;
}

// Convert between file extensions and Prism language prop
const extensionToLanguage = {
	c: "c",
	cpp: "cpp",
	css: "css",
	js: "javascript",
	jsx: "jsx",
	go: "go",
	json: "json",
	md: "markdown",
	py: "python",
	tsx: "tsx",
	ts: "typescript",
	yaml: "yaml",
};

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
		fontFamily: theme.fontFamily,
	},
	textPrompt: {
		fontFamily: theme.fontFamily,
	},
	chButton: {
		backgroundColor: "#0C4160",
	},
	footer: {
		backgroundColor: "transparent",
		color: "#626378",
		borderTop: "unset",
	},
}));

const maxCodeCards = 15;

export default function CodehopLayout(props: CodehopLayoutProps) {
	const [codeCardProps, codeCardPropsHandlers] = useListState<CodeCardProps>(
		[]
	);

	// useEffect(() => {
	// 	codeCardPropsHandlers.setState(props.codeCardProps);
	// }, [codeCardPropsHandlers, props.codeCardProps]);

	useEffect(() => {
		codeCardPropsHandlers.setState(props.codeCardProps);
	}, [codeCardPropsHandlers]);

	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);
	const [savedCollectionID, setSavedCollectionID] = useState(null);
	const [savingCollection, setSavingCollection] = useState(false);
	const { classes, cx } = useStyles();
	const clipboard = useClipboard({ timeout: 500 });
	const router = useRouter();
	const { data: session } = useSession();

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
		console.log("removeCodeCard", "id", id, "codeCardProps", codeCardProps);
		const idx = codeCardProps.findIndex((x) => x.id === id);
		console.log("idx", idx);
		codeCardPropsHandlers.filter((item) => item.id !== id);
	}

	function updateCodeCardNote(id: string, note: string) {
		console.log("updateCodeCardNote", "id", id, "codeCardProps", codeCardProps);
		const idx = codeCardProps.findIndex((x) => x.id === id);
		console.log("idx", idx);
		codeCardPropsHandlers.setItemProp(idx, "note", note);
	}

	function addCodeCard(url: string) {
		console.log("addCodeCard", "url", url, "codeCardProps", codeCardProps);

		if (codeCardProps.length >= maxCodeCards) {
			showNotification({
				color: "red",
				message: `Cannot have more than ${maxCodeCards} cards in a single collection`,
			});

			return;
		}

		const cardID = v4();
		// console.log("url", url, "cardID", cardID);

		const parts = url.split("#L");

		const rawURL = parts[0]
			.replace("github.com", "raw.githubusercontent.com")
			.replace("blob/", "");

		// const urlParts = parts[0].split("/");
		const apiURL = parts[0]
			.replace("github.com", "api.github.com/repos")
			.replace("/blob", "/contents");

		const urlParts = apiURL.split("/");
		urlParts.splice(7, 1);
		// console.log("urlParts", urlParts);

		const newParts = urlParts.slice(2);

		const newApiURL = "https://" + newParts.join("/");
		// console.log("newApiURL", newApiURL);

		// console.log("apiURL", apiURL);

		const fileExt = rawURL.split(".").pop();
		// console.log("fileExt", fileExt);
		// console.log(extensionToLanguage[fileExt]);

		// console.log(Number(parts[1]));
		codeCardPropsHandlers.append({
			id: cardID,
			apiURL: newApiURL,
			token: session ? (session.accessToken as string) : null,
			lineNumber: Number(parts[1]),
			language: extensionToLanguage[fileExt],
			providedURL: url,

			isSavedCollection: props.isSavedCollection,
			note: "",

			onRemove: removeCodeCard,
			onNoteChange: updateCodeCardNote,
		});

		// console.log(codeCardProps);
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

		// console.log(resp.id);

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
					<Header height={70} p="sm">
						<Group position="apart">
							<Anchor href="/" className={classes.titleAnchor}>
								<Title style={{ fontFamily: "Permanent Marker" }}>
									CODEHOP
								</Title>
							</Anchor>
							<LoginButton />
						</Group>
					</Header>
				}
				footer={
					<Footer className={classes.footer} height={50} p="sm">
						<Center>
							<Anchor
								href="https://github.com/adamdevigili"
								className={classes.titleAnchor}
								target="_blank"
							>
								<Text size="md">created by @adamdevigili</Text>
							</Anchor>
						</Center>
					</Footer>
				}
			>
				<Stack
					// align="stretch"
					style={{ height: "100%" }}
					// style={{ height: "100%", border: "1px solid green" }}
					justify={codeCardProps.length === 0 ? "center" : "flex-start"}
				>
					<Container>
						{!props.isSavedCollection && (
							<form
								onSubmit={urlInput.onSubmit((values) => {
									addCodeCard(values.url);
									urlInput.setValues({ url: "" });
								})}
							>
								<Group noWrap={true}>
									<TextInput
										placeholder="Link to file and line number"
										{...urlInput.getInputProps("url")}
										style={{ width: 300 }}
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
						)}

						<Group>
							<Button onClick={addTestURL1}>Add Test URL 1</Button>
							<Button onClick={addTestURL2}>Add Test URL 2</Button>
							<Button onClick={addTestURL3}>Add Test URL 3</Button>
							<Button onClick={addAll}>Add All</Button>
						</Group>
					</Container>
					<Container style={{ width: "100%" }} fluid={true}>
						{codeCardProps.length == 0 ? (
							<Center>
								<Title className={classes.textPrompt}>
									Start by adding GitHub links to files
								</Title>
								<HoverCard width={280} shadow="md">
									<HoverCard.Target>
										<Title>*</Title>
									</HoverCard.Target>
									<HoverCard.Dropdown>
										<Text size="sm">
											You must be signed in to GitHub to add private
											repositories. Organization repositories cannot currently
											be added.
										</Text>
									</HoverCard.Dropdown>
								</HoverCard>
							</Center>
						) : (
							<CodeCardCollection
								codeCardProps={codeCardProps}
								collectionID={props.collectionID}
							/>
						)}
					</Container>
				</Stack>
			</AppShell>
		</div>
	);
}
