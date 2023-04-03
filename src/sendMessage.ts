export const sendMessage =  (eventType: string, data: any) => {
	console.log('data sent', {
		source: "customer-app",
		eventType,
		payload: data,
	});

	window.parent?.postMessage(
		{
			source: "customer-app",
			eventType,
			payload: data,
		},
		"*"
	);
};