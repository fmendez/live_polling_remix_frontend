export interface PollData {
    id: number;
    title: string;
    description: string;
    options: PollOption[]
}

export interface PollOption {
    id: number;
    content: string;
    votes?: { id: number }[];
}
