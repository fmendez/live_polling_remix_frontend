import { json, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import PollCard from "~/components/PollCard";
import type { Poll } from "~/lib/types";

export const loader: LoaderFunction = async () => {
	const response = await fetch("http://localhost:3000/api/v1/polls");
	return json(await response.json());
};

export default function Polls() {
	const polls = useLoaderData<typeof loader>();

	return (
		<div>
			<h1 className="text-3xl font-bold text-purple-800 mb-6">Polls</h1>
			<ul className="space-y-4">
				{polls.map((poll: Poll) => (
					<li key={poll.id}>
						<PollCard poll={poll} />
					</li>
				))}
			</ul>
		</div>
	);
}
