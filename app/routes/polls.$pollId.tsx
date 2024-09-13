import {
	Form,
	json,
	useLoaderData,
	useActionData,
	redirect,
} from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type { PollOption } from "~/lib/types";

export const loader: LoaderFunction = async ({ params }) => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/v1/polls/${params.pollId}`,
		);
		if (!response.ok) {
			throw new Error("Failed to fetch poll");
		}
		const poll = await response.json();
		return json(poll);
	} catch (error) {
		console.error("Error loading poll:", error);
		return json({ error: "Failed to load poll" }, { status: 500 });
	}
};

export const action: ActionFunction = async ({ request, params }) => {
	const formData = await request.formData();
	const optionId = formData.get("optionId");

	if (!optionId) {
		return json({ error: "Please select an option" }, { status: 400 });
	}

	try {
		const response = await fetch(
			`http://localhost:3000/api/v1/polls/${params.pollId}/votes`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ vote: { option_id: optionId } }),
			},
		);

		if (!response.ok) {
			throw new Error("Failed to cast vote");
		}

		return redirect(`/polls/${params.pollId}`);
	} catch (error) {
		console.error("Error casting vote:", error);
		return json({ error: "Failed to cast vote" }, { status: 500 });
	}
};

export default function Poll() {
	const data = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();

	if ("error" in data) {
		return <div className="text-red-600 text-center">{data.error}</div>;
	}

	return (
		<div className="bg-yellow-50 rounded-lg shadow-md p-6">
			<h1 className="text-3xl font-bold text-yellow-800 mb-4">{data.title}</h1>
			<p className="text-yellow-700 mb-6">{data.description}</p>
			<Form method="post" className="space-y-4">
				{actionData?.error && (
					<p className="text-red-600">{actionData.error}</p>
				)}
				{data.options.map((option: PollOption) => (
					<div key={option.id} className="flex items-center">
						<input
							type="radio"
							id={option.id.toString()}
							name="optionId"
							value={option.id}
							className="mr-2"
						/>
						<label htmlFor={option.id.toString()} className="text-yellow-800">
							{option.content} - Votes: {option.votes?.length || 0}
						</label>
					</div>
				))}
				<button
					type="submit"
					className="bg-green-300 text-green-800 px-4 py-2 rounded hover:bg-green-400 transition duration-300"
				>
					Vote
				</button>
			</Form>
		</div>
	);
}
