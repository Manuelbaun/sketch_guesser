// Temp function to help getting Ip address...
// to see if clients are actually on different public ips
var xhr = new XMLHttpRequest();

export function getPublicIpAddress() {
	return new Promise((resolve, reject) => {
		// Setup our listener to process compeleted requests
		xhr.onreadystatechange = function() {
			// Only run if the request is complete
			if (xhr.readyState !== 4) return;

			// Process our return data
			if (xhr.status >= 200 && xhr.status < 300) {
				// What do when the request is successful
				const data = JSON.parse(xhr.response);
				resolve({ code: xhr.status, msg: data.ip });
			} else {
				// What to do when the request has failed
				reject({ code: '0', msg: xhr });
			}
		};
		xhr.open('GET', 'https://api.ipify.org?format=json');
		xhr.send();
	});
}
