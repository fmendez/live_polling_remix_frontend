import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	LiveReload,
} from "@remix-run/react";
import Layout from "./components/Layout";
import "./tailwind.css";

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Layout>
					<Outlet />
				</Layout>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
