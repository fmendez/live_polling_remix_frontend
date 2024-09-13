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
			<h1>Polls</h1>
			<ul>
				{polls.map((poll: Poll) => (
					<li key={poll.id}>
						<PollCard poll={poll} />
					</li>
				))}
			</ul>
		</div>
	);
}
