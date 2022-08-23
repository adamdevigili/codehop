// import "../styles/globals.css";
import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	return (
		<>
			<Head>
				<title>Codehop - Visualize Code Connections</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					/** Put your mantine theme override here */
					colorScheme: "dark",
					// fontFamily: "'Permanent Marker', cursive",
					colors: {
						// override dark colors to change them for all components
						dark: [
							"#d5d7e0", // title text
							"#acaebf",
							"#8c8fa3",
							"#666980", // input text
							"#4d4f66", // input border
							"#34354a",
							"#2b2c3d", // input background
							"#0C4160", // header
							"#071330", // main
							"#01010a",
						],
					},
				}}
			>
				<NotificationsProvider position="top-right">
					<SessionProvider session={pageProps.session}>
						<Component {...pageProps} />
					</SessionProvider>
				</NotificationsProvider>
			</MantineProvider>
		</>
	);
}
