import { json, useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import PollCard from "~/components/PollCard";
import type { Poll } from "~/lib/types";

export const loader: LoaderFunction = async () => {
	try {
		const response = await fetch("http://localhost:3000/api/v1/polls");
		if (!response.ok) {
			throw new Error("Failed to fetch polls");
		}
		const polls = await response.json();
		return json(polls);
	} catch (error) {
		console.error("Error loading polls:", error);
		return json({ error: "Failed to load polls" }, { status: 500 });
	}
};

export default function Polls() {
	const data = useLoaderData<typeof loader>();

	if ("error" in data) {
		return <div className="text-red-600 text-center">{data.error}</div>;
	}

	return (
		<div>
			<h1 className="text-3xl font-bold text-purple-800 mb-6">Polls</h1>
			<ul className="space-y-4">
				{data.map((poll: Poll) => (
					<li key={poll.id}>
						<PollCard poll={poll} />
					</li>
				))}
			</ul>
			<Link
				to="/polls/new"
				className="mt-6 inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300"
			>
				Create New Poll
			</Link>
		</div>
	);
}
