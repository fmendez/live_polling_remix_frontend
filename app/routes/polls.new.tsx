import { Form, redirect, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const title = formData.get("title");
	const description = formData.get("description");
	const options = formData.getAll("options");

	if (!title || !description || options.length < 2) {
		return { error: "Please fill all required fields" };
	}

	try {
		const response = await fetch("http://localhost:3000/api/v1/polls", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				poll: {
					title,
					description,
					options_attributes: options.map((o) => ({ content: o })),
				},
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to create poll");
		}

		return redirect("/polls");
	} catch (error) {
		console.error("Error creating poll:", error);
		return { error: "Failed to create poll" };
	}
};

export default function NewPoll() {
	const actionData = useActionData<typeof action>();

	return (
		<div className="bg-blue-50 rounded-lg shadow-md p-6">
			<h1 className="text-3xl font-bold text-blue-800 mb-6">Create New Poll</h1>
			<Form method="post" className="space-y-4">
				{actionData?.error && (
					<p className="text-red-600">{actionData.error}</p>
				)}
				<div>
					<label htmlFor="title" className="block text-blue-700 mb-2">
						Title:
					</label>
					<input
						type="text"
						id="title"
						name="title"
						required
						className="w-full p-2 border border-blue-300 rounded"
					/>
				</div>
				<div>
					<label htmlFor="description" className="block text-blue-700 mb-2">
						Description:
					</label>
					<textarea
						id="description"
						name="description"
						required
						className="w-full p-2 border border-blue-300 rounded"
					/>
				</div>
				<div>
					<label htmlFor="option1" className="block text-blue-700 mb-2">
						Option 1:
					</label>
					<input
						type="text"
						id="option1"
						name="options"
						required
						className="w-full p-2 border border-blue-300 rounded"
					/>
				</div>
				<div>
					<label htmlFor="option2" className="block text-blue-700 mb-2">
						Option 2:
					</label>
					<input
						type="text"
						id="option2"
						name="options"
						required
						className="w-full p-2 border border-blue-300 rounded"
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
				>
					Create Poll
				</button>
			</Form>
		</div>
	);
}
