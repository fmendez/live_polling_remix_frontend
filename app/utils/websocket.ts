let socket: WebSocket | null = null;

export function getSocket(): WebSocket {
    if (!socket) {
        socket = new WebSocket('ws://localhost:3000/cable');

        socket.onopen = () => {
            console.log('WebSocket connected');
            if (socket) {
                socket.send(JSON.stringify({
                    command: 'subscribe',
                    identifier: JSON.stringify({ channel: 'PollChannel' }),
                }));
            };
        }

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
            socket = null;
        };
    }

    return socket;
}