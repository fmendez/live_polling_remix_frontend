import { Link } from "@remix-run/react";
import type { Poll } from "~/lib/types";

export default function PollCard({ poll }: { poll: Poll }) {
	return (
		<div>
			<h2>{poll.title}</h2>
			<p>{poll.description}</p>
			<Link to={`/polls/${poll.id}`}>Vote Now</Link>
		</div>
	);
}
