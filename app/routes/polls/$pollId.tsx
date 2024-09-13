import { json, useLoaderData, useParams } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import type { PollOption } from "~/lib/types";

export const loader: LoaderFunction = async ({ params }) => {
	const response = await fetch(
		`http://localhost:3000/api/v1/polls/${params.pollId}`,
	);
	return json(await response.json());
};

export default function Poll() {
	const poll = useLoaderData<typeof loader>();

	return (
		<div>
			<h1>{poll.title}</h1>
			<p>{poll.description}</p>
			<ul>
				{poll.options.map((option: PollOption) => (
					<li key={option.id}>{option.content}</li>
				))}
			</ul>
		</div>
	);
}
