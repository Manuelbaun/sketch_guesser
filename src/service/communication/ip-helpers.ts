// Temp function to help getting Ip address...
// to see if clients are actually on different public ips
var xhr = new XMLHttpRequest();

// For some reason, getting the actual IP-Address
// does not work in the brave browser
export function getPublicIpAddress() {
	return new Promise((resolve, reject) => {
		// Setup our listener to process compeleted requests
		xhr.onreadystatechange = function() {
			// Only run if the request is complete
			if (xhr.readyState !== 4) return;

			// Process our return data
			if (xhr.status >= 200 && xhr.status < 300) {
				// What do when the request is successful

				resolve({ code: xhr.status, msg: xhr.response });
			} else {
				// What to do when the request has failed
				reject({ code: '0', msg: xhr });
			}
		};
		xhr.open('GET', 'http://ipinfo.io/ip');
		xhr.send();
	});
}
