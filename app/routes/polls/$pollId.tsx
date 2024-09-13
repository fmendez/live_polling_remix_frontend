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
		<div className="bg-yellow-50 rounded-lg shadow-md p-6">
			<h1 className="text-3xl font-bold text-yellow-800 mb-4">{poll.title}</h1>
			<p className="text-yellow-700 mb-6">{poll.description}</p>
			<ul className="space-y-2">
				{poll.options.map((option: PollOption) => (
					<li
						key={option.id}
						className="bg-yellow-100 p-3 rounded-md text-yellow-800 hover:bg-yellow-200 transition duration-300"
					>
						{option.content}
					</li>
				))}
			</ul>
		</div>
	);
}
