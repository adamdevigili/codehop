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
	ScrollArea,
	createStyles,
	Grid,
	Center,
	useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import CodeCard, { CodeCardProps } from "./CodeCard";
import { ArrowRight } from "tabler-icons-react";

const lineHighlight = { color: "orange", label: "" };

export interface CodeCardCollectionProps {
	codeCardProps: CodeCardProps[];
	collectionID: string;
}

const useStyle = createStyles(() => ({
	arrow: {},
	cardGroup: {
		gap: 0,
	},
}));

export default function CodeCardCollection(props: CodeCardCollectionProps) {
	const { classes } = useStyle();
	const theme = useMantineTheme();

	return (
		<ScrollArea
			// style={{ width: "100%", border: "1px solid blue" }}
			dir="ltr"
			offsetScrollbars={true}
		>
			<Group noWrap={true} className={classes.cardGroup} position="center">
				{props.codeCardProps.map((codeCardProp) => (
					<Center key={codeCardProp.id}>
						{codeCardProp.idx !== 0 && (
							<ArrowRight
								color={theme.colors.dark[0]}
								className={classes.arrow}
							/>
						)}

						<CodeCard
							key={codeCardProp.id}
							id={codeCardProp.id}
							idx={codeCardProp.idx}
							url={codeCardProp.url}
							apiURL={codeCardProp.apiURL}
							token={codeCardProp.token}
							lineNumber={codeCardProp.lineNumber}
							language={codeCardProp.language}
							providedURL={codeCardProp.providedURL}
							onRemove={codeCardProp.onRemove}
							isSavedCollection={codeCardProp.isSavedCollection}
						/>
					</Center>
				))}
			</Group>
		</ScrollArea>
	);
}
