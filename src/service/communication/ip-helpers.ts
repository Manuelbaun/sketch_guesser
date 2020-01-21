// Temp function to help getting Ip address...
// to see if clients are actually on different public ips

export function getPublicIpAddress() {
	return new Promise((resolve, reject) => {
		fetch('https://api.ipify.org?format=json')
			.then(function(response) {
				if (response.status !== 200) {
					reject({ code: response.status, msg: 'some error with statuscode' });
					return;
				}

				// Examine the text in the response
				response.json().then(function(data) {
					resolve({ code: 200, msg: data });
				});
			})
			.catch(function(err) {
				console.error('Fetch Error :-S', err);
				reject({ code: '0', msg: err });
			});
	});
}
