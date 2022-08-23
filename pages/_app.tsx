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
				<title>codehop</title>
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
							"#d5d7e0", // 0 - title text
							"#acaebf", // 1
							"#8c8fa3", // 2
							"#666980", // 3 - input text
							"#4d4f66", // 4 - input border
							"#34354a", // 5
							"#2b2c3d", // 6 - input background
							"#0C4160", // 7 - header
							"#071330", // 8 - main
							"#01010a", // 9
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
