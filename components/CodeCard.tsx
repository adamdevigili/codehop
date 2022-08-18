import { Prism } from "@mantine/prism";
import {
	Card,
	Image,
	Text,
	Badge,
	Button,
	Group,
	Container,
	Stack,
	createStyles,
	Anchor,
	Code,
	Textarea,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useViewportSize } from "@mantine/hooks";
import { Language } from "prism-react-renderer";
import { Pencil } from "tabler-icons-react";

const lineHighlight = { color: "orange", label: "" };

export interface CodeCardProps {
	id: string;

	// URL provided by user
	providedURL: string;

	// Parsed URL for GH API
	apiURL: string;

	// User token if logged in
	token: string;

	// Code line number
	lineNumber: number;

	// Target language
	language: string;

	// Flag to note if this card belongs to a saved collection
	// Impacts conditional renders
	isSavedCollection: boolean;

	// Note for adding extra context
	note: string;

	// State modifiers
	onRemove: (id: string) => void;
	onNoteChange: (id: string, note: string) => void;
}

const useStyle = createStyles(() => ({
	cardLink: {
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
	card: {
		height: "70vh",
	},
	prism: {
		// border: "1px solid blue",
		height: "95%",
		display: "flex",
		flexDirection: "column",
	},
	cardNote: {
		// border: "1px solid red",
		border: "0px none",
		// height: "5%",
		// color: "red",
	},
}));

export default function CodeCard(props: CodeCardProps) {
	const [code, setCode] = useState("");
	const [linesOfCode, setLinesOfCode] = useState(0);
	const [isLoading, setLoading] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);

	// useEffect(() => {
	// 	setLoading(true);
	// 	fetch(props.url)
	// 		.then((res) => {
	// 			return res.text();
	// 		})
	// 		.then((data) => {
	// 			setCode(data);
	// 			setLoading(false);
	// 			return data;
	// 		})
	// 		.then((data) => {
	// 			scrollToLineNumber(data);
	// 		});
	// }, []);

	useEffect(() => {
		setLoading(true);
		// Fetch initial payload from GH API
		fetch(
			props.apiURL,
			// Only provide auth headers if user is signed in
			props.token
				? {
						headers: {
							Authorization: `token ${props.token}`,
							Accept: "application/vnd.github+json",
						},
				  }
				: null
		)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				// console.log(data);
				fetch(data.download_url, {})
					.then((data) => {
						return data.text();
					})
					.then((data) => {
						setCode(data);
						setLoading(false);
						return data;
					})
					.then((data) => {
						scrollToLineNumber(data);
					});
			});
	}, []);

	const { classes } = useStyle();

	const lineNumberObj = {
		[props.lineNumber]: lineHighlight,
	};

	const prismViewport = useRef<HTMLDivElement>();

	const scrollToLineNumber = async (data: any) => {
		await new Promise((r) => setTimeout(r, 100));

		const scrollAreaViewport = prismViewport.current
			.getElementsByClassName("mantine-ScrollArea-root")[0]
			.getElementsByClassName("mantine-ScrollArea-viewport")[0];

		// Get line count
		const loc = data.split(/\r\n|\r|\n/).length - 1;

		// Calculate scroll location target
		const targetPos =
			(props.lineNumber / loc) * scrollAreaViewport.scrollHeight -
			scrollAreaViewport.clientHeight / 2;

		scrollAreaViewport.scrollTo({
			top: targetPos,
			behavior: "smooth",
		});
	};

	return (
		<Container size="sm" px="m">
			<Stack>
				<Group position="apart">
					<Anchor
						target="_blank"
						href={props.providedURL}
						className={classes.cardLink}
					>
						<Code>{props.providedURL.replace("https://github.com/", "")}</Code>
					</Anchor>
					{!props.isSavedCollection && (
						<Button
							size="xs"
							color={"red"}
							onClick={() => props.onRemove(props.id)}
						>
							Remove
						</Button>
					)}
				</Group>

				<Card
					shadow="sm"
					p="lg"
					radius="md"
					withBorder
					className={classes.card}
				>
					{isLoading ? (
						<Text size="lg">Loading...</Text>
					) : (
						<Prism
							// scrollAreaComponent="card"
							// trim={false}
							withLineNumbers
							noCopy
							language={props.language as Language}
							// language="javascript"
							highlightLines={lineNumberObj}
							className={classes.prism}
							ref={prismViewport}
						>
							{code}
						</Prism>
					)}
					<Textarea
						className={classes.cardNote}
						// placeholder={props.note ? props.note : "Add a note"}
						placeholder={!props.note && "Add a note"}
						defaultValue={props.note}
						maxRows={1}
						autosize={true}
						styles={{ input: { border: "0px none" } }}
						// variant="filled"
						// icon={<Pencil />}
						onBlur={(event) =>
							props.onNoteChange(props.id, event.currentTarget.value)
						}
					/>
				</Card>
			</Stack>
		</Container>
	);
}
