import { Link } from "@remix-run/react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const currentYear = new Date().getFullYear();

	return (
		<div>
			<header>
				<nav>
					<Link to="/">Home</Link>
					<Link to="/polls">Polls</Link>
				</nav>
			</header>
			<main>{children}</main>
			<footer>© {currentYear} Live Polling App</footer>
		</div>
	);
}
