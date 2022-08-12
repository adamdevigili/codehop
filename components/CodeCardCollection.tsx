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
} from "@mantine/core";
import { useEffect, useState } from "react";
import CodeCard, { CodeCardProps } from "./CodeCard";

const lineHighlight = { color: "orange", label: "" };

export interface CodeCardCollectionProps {
	codeCardProps: CodeCardProps[];
}

export default function CodeCardCollection(props: CodeCardCollectionProps) {
	return (
		<Group>
			{props.codeCardProps.map((codeCardProp) => (
				<CodeCard
					key={codeCardProp.id}
					id={codeCardProp.id}
					url={codeCardProp.url}
					lineNumber={codeCardProp.lineNumber}
					language={codeCardProp.language}
					providedURL={codeCardProp.providedURL}
					onRemove={codeCardProp.onRemove}
				/>
			))}
		</Group>
	);
}
