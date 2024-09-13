import { useEffect, useState } from "react";
import {
	Form,
	json,
	useLoaderData,
	useActionData,
	redirect,
	useFetcher,
} from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type { PollData, PollOption } from "~/lib/types";
import { getSocket } from "~/utils/websocket";

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
	const initialData = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const fetcher = useFetcher();
	const [pollData, setPollData] = useState(initialData);
	const [votedOptionId, setVotedOptionId] = useState<number | null>(null);

	useEffect(() => {
		const socket = getSocket();

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.message && data.message.poll_id === pollData.id) {
				setPollData((prevData: PollData) => ({
					...prevData,
					options: prevData.options.map((option: PollOption) =>
						option.id === data.message.option_id
							? { ...option, votes: new Array(data.message.votes_count) }
							: option,
					),
				}));
			}
		};

		return () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(
					JSON.stringify({
						command: "unsubscribe",
						identifier: JSON.stringify({ channel: "PollChannel" }),
					}),
				);
			}
		};
	}, [pollData.id]);

	const handleVote = (optionId: number) => {
		setVotedOptionId(optionId);
		fetcher.submit(
			{ optionId: optionId.toString() },
			{ method: "post", action: `/polls/${pollData.id}` },
		);
	};

	if ("error" in pollData) {
		return <div className="text-red-600 text-center">{pollData.error}</div>;
	}

	const isVoted = votedOptionId !== null || fetcher.state === "submitting";

	return (
		<div className="bg-yellow-50 rounded-lg shadow-md p-6">
			<h1 className="text-3xl font-bold text-yellow-800 mb-4">
				{pollData.title}
			</h1>
			<p className="text-yellow-700 mb-6">{pollData.description}</p>
			{actionData?.error && (
				<p className="text-red-600 mb-4">{actionData.error}</p>
			)}
			<div className="space-y-4">
				{pollData.options.map((option: PollOption) => (
					<div key={option.id} className="flex items-center justify-between">
						<button
							onClick={() => handleVote(option.id)}
							disabled={isVoted}
							className={`flex-grow text-left px-4 py-2 rounded transition duration-300 ${
								isVoted
									? "bg-gray-100 text-gray-500 cursor-not-allowed"
									: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
							} ${
								votedOptionId === option.id ? "border-2 border-green-500" : ""
							}`}
							type="button"
						>
							<span className="flex items-center">
								{option.content}
								{votedOptionId === option.id && (
									<svg
										className="ml-2 h-5 w-5 text-green-500"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-label="Voted"
									>
										<title>Voted</title>
										<path d="M5 13l4 4L19 7" />
									</svg>
								)}
							</span>
						</button>
						<span className="ml-4 text-yellow-800">
							Votes: {option.votes?.length || 0}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
