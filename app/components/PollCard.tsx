import { Link } from "@remix-run/react";
import type { Poll } from "~/lib/types";

export default function PollCard({ poll }: { poll: Poll }) {
	return (
		<div className="bg-blue-100 rounded-lg shadow-md p-6 mb-4">
			<h2 className="text-xl font-semibold text-blue-800 mb-2">{poll.title}</h2>
			<p className="text-blue-600 mb-4">{poll.description}</p>
			<Link
				to={`/polls/${poll.id}`}
				className="bg-green-300 text-green-800 px-4 py-2 rounded hover:bg-green-400 transition duration-300"
			>
				Vote Now
			</Link>
		</div>
	);
}
