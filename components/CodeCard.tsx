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
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useViewportSize } from "@mantine/hooks";
import { Language } from "prism-react-renderer";

const lineHighlight = { color: "orange", label: "" };

export interface CodeCardProps {
	id: string;
	url: string;
	providedURL: string;
	lineNumber: number;
	language: string;
	onRemove: (key: string) => void;
	isSavedCollection: boolean;
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
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},
}));

export default function CodeCard(props: CodeCardProps) {
	const [code, setCode] = useState("");
	const [linesOfCode, setLinesOfCode] = useState(0);
	const [isLoading, setLoading] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);

	useEffect(() => {
		setLoading(true);
		fetch(props.url)
			.then((res) => {
				return res.text();
			})
			.then((data) => {
				setCode(data);
				setLoading(false);
				return data;
			})
			.then((data) => {
				scrollToLineNumber(data);
			});
	}, []);

	const { classes } = useStyle();

	const lineNumberObj = {
		[props.lineNumber]: lineHighlight,
	};

	const prismViewport = useRef<HTMLDivElement>();
	// const prismScrollAreaViewport = useRef<HTMLDivElement>(prismViewport.current.getElementsByClassName("mantine-ScrollArea-root")[0]);

	// const scrollToCenter = () =>
	// 	prismViewport.current.scrollTo({
	// 		top: prismViewport.current.scrollHeight / 2,
	// 		behavior: "smooth",
	// 	});

	const scrollToBottom = () => {
		const scrollAreaViewport = prismViewport.current
			.getElementsByClassName("mantine-ScrollArea-root")[0]
			.getElementsByClassName("mantine-ScrollArea-viewport")[0];
		// const pView =
		// console.log(
		// 	"current",
		// 	prismViewport.current.getElementsByClassName("mantine-ScrollArea-root")[0]
		// );
		scrollAreaViewport.scrollTo({
			top: scrollAreaViewport.scrollHeight,
			behavior: "smooth",
		});
	};

	const scrollToLineNumber = async (data: any) => {
		await new Promise((r) => setTimeout(r, 500));

		const scrollAreaViewport = prismViewport.current
			.getElementsByClassName("mantine-ScrollArea-root")[0]
			.getElementsByClassName("mantine-ScrollArea-viewport")[0];
		// const pView =
		// console.log(
		// 	"current",
		// 	prismViewport.current.getElementsByClassName("mantine-ScrollArea-root")[0]
		// );

		// console.log(code);
		const loc = data.split(/\r\n|\r|\n/).length - 1;
		// console.log("loc", loc);

		const targetPos =
			(props.lineNumber / loc) * scrollAreaViewport.scrollHeight -
			scrollAreaViewport.clientHeight / 2;

		// console.log(
		// 	"lineNumber",
		// 	props.lineNumber,
		// 	"linesOfCode",
		// 	linesOfCode,
		// 	"scrollHeight",
		// 	scrollAreaViewport.scrollHeight,
		// 	"clientHeight",
		// 	scrollAreaViewport.clientHeight,
		// 	"targetPos",
		// 	targetPos
		// );

		scrollAreaViewport.scrollTo({
			top: targetPos,
			behavior: "smooth",
		});
	};

	// if (!isLoading) {
	// 	scrollToLineNumber();
	// }

	return (
		<Container size="sm" px="m">
			<Stack>
				<Anchor
					target="_blank"
					href={props.providedURL}
					className={classes.cardLink}
				>
					<Text component="a" size="sm">
						{props.providedURL.replace("https://github.com/", "")}
					</Text>
				</Anchor>
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
				</Card>
				{!props.isSavedCollection && (
					<Button
						size="sm"
						color={"red"}
						onClick={() => props.onRemove(props.id)}
					>
						Remove
					</Button>
				)}
			</Stack>
		</Container>
	);
}
