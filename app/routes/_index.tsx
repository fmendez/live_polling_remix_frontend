import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [
		{ title: "Live Polling App" },
		{
			name: "description",
			content: "Create and participate in real-time polls!",
		},
	];
};

export default function Index() {
	return (
		<div className="text-center">
			<h1 className="text-4xl font-bold text-purple-800 mb-4">
				Welcome to Live Polling
			</h1>
			<p className="text-xl text-purple-600">
				Create and participate in real-time polls!
			</p>
		</div>
	);
}
