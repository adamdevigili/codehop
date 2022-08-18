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
} from "@mantine/core";
import { useEffect, useState } from "react";
import CodeCard, { CodeCardProps } from "./CodeCard";

export interface CodeCardCollectionProps {
	codeCardProps: CodeCardProps[];
	collectionID: string;
}

export default function CodeCardCollection(props: CodeCardCollectionProps) {
	return (
		<ScrollArea
			// style={{ width: "100%", border: "1px solid blue" }}
			// styles={{
			// 	scrollbar: {
			// 		border: "1px solid blue",
			// 		position: "absolute",
			// 		bottom: -20,
			// 	},
			// }}
			dir="ltr"
			offsetScrollbars={true}
			type="always"
		>
			<Group noWrap={true}>
				{props.codeCardProps.map((codeCardProp) => (
					<CodeCard
						key={codeCardProp.id}
						id={codeCardProp.id}
						// url={codeCardProp.url}
						apiURL={codeCardProp.apiURL}
						token={codeCardProp.token}
						lineNumber={codeCardProp.lineNumber}
						language={codeCardProp.language}
						providedURL={codeCardProp.providedURL}
						isSavedCollection={codeCardProp.isSavedCollection}
						note={codeCardProp.note}
						onRemove={codeCardProp.onRemove}
						onNoteChange={codeCardProp.onNoteChange}
					/>
				))}
			</Group>
		</ScrollArea>
	);
}
