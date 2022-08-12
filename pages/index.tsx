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
} from "@mantine/core";
import { useListState, useId } from "@mantine/hooks";
import React, { useEffect, useRef, useState } from "react";
import CodeCard, { CodeCardProps } from "../components/CodeCard";
import CodeCardCollection, {
	CodeCardCollectionProps,
} from "../components/CodeCardCollection";
import { useForm } from "@mantine/form";
import { randomUUID } from "crypto";
import { v4 } from "uuid";
import { NextApiRequest } from "next";
import CodehopLayout from "../components/CodehopLayout";

export default function Home() {
	return (
		<CodehopLayout
			codeCardProps={[]}
			collectionID=""
			isSavedCollection={false}
		/>
	);
}
