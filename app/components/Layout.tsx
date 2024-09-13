import { Link } from "@remix-run/react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const currentYear = new Date().getFullYear();

	return (
		<div className="min-h-screen flex flex-col bg-pink-50">
			<header className="bg-purple-200 p-4">
				<nav className="container mx-auto flex justify-between items-center">
					<Link to="/" className="text-2xl font-bold text-purple-800">
						Live Polling
					</Link>
					<div>
						<Link to="/" className="text-purple-800 hover:text-purple-600 mr-4">
							Home
						</Link>
						<Link to="/polls" className="text-purple-800 hover:text-purple-600">
							Polls
						</Link>
					</div>
				</nav>
			</header>
			<main className="container mx-auto flex-grow p-4">{children}</main>
			<footer className="bg-purple-200 p-4 text-center text-purple-800">
				© {currentYear} Live Polling App
			</footer>
		</div>
	);
}
