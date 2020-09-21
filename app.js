(function () {
	'use strict';

	var SDK = window.__LIFERAY_REMOTE_APP_SDK__;

	if (!SDK) {
		console.error('No __LIFERAY_REMOTE_APP_SDK__ on window');

		return;
	}

	var client = new SDK.Client({debug: true});

	client
		.get('css')
		.then(function (url) {
			const link = document.createElement('link');

			link.href = url;
			link.rel = 'stylesheet';
			link.type = 'text/css';

			document.head.appendChild(link);
		})
		.catch(function (error) {
			console.error(error);
		});

	function appendResult(elementOrString) {
		var results = document.getElementById('results');

		var result = document.createElement('div');

		result.classList.add('result');

		if (typeof elementOrString === 'string') {
			result.appendChild(document.createTextNode(elementOrString));
		} else {
			result.appendChild(elementOrString);
		}

		const timestamp = document.createElement('span');

		timestamp.classList.add('timestamp');

		timestamp.appendChild(
			document.createTextNode(new Date().toLocaleTimeString())
		);

		result.appendChild(timestamp);

		results.appendChild(result);

		results.scrollTop = results.scrollHeight;
	}

	function button(id, handler) {
		document.getElementById(id).addEventListener('click', function () {
			try {
				handler(event);
			} catch (error) {
				console.error(error);
			}
		});
	}

	function dumpResponse(response) {
		if (
			typeof console.table === 'function' &&
			typeof Object.entries === 'function'
		) {
			console.table(Object.entries(response));
		} else {
			console.log(
				'ok',
				response.ok,
				'status',
				response.status,
				'statusText',
				response.statusText,
				'url',
				response.url,
				'redirected',
				response.redirected
			);
		}
	}

	function pre(text) {
		var element = document.createElement('pre');

		var code = element.appendChild(document.createElement('code'));

		code.appendChild(document.createTextNode(text));

		return element;
	}

	// This one is (currently) a demo of firing an event before the host side is
	// fully ready. The SDK will retry with exponential backoff until it
	// succeeds.

	client.openToast({
		message: 'Welcome to the danger zone',
		type: 'danger',
	});

	button('hello', function () {
		var message = 'Hello from the other side';

		client.openToast({message});

		appendResult(message);
	});

	button('error', function () {
		// This one is an error because you can only register one client per
		// iframe.

		var client = new SDK.Client();

		client.on('error', function (error) {
			appendResult('Got an error: ' + JSON.stringify(error));
		});
	});

	button('registration', function (event) {
		var element = event.currentTarget;

		if (element.innerText.includes('Unregister')) {
			client.dispose();

			element.innerText = 'Register';
		} else {
			client = new SDK.Client();

			element.innerText = 'Unregister';
		}
	});

	button('extend', function () {
		client
			.fetch('http://0.0.0.0:8080/c/portal/extend_session')
			.then(function () {
				appendResult('extended');
			})
			.catch(function (error) {
				console.log('caught', error);
			});
	});

	button('json', function () {
		// NOTE: Using "guest" as siteID is naughty, but I don't want to rely on the
		// potentially unstable numeric ID from my dev environment (20122).
		client
			.fetch(
				'http://0.0.0.0:8080/o/headless-delivery/v1.0/sites/guest/structured-contents/'
			)
			.then(function (response) {
				dumpResponse(response);

				return response.json();
			})
			.then(function (json) {
				appendResult(pre(JSON.stringify(json, null, 2)));
			})
			.catch(function (error) {
				console.log('caught', error);
			});
	});

	button('text', function () {
		// NOTE: Using "guest" as siteID is naughty, but I don't want to rely on the
		// potentially unstable numeric ID from my dev environment (20122).
		client
			.fetch(
				'http://0.0.0.0:8080/o/headless-delivery/v1.0/sites/guest/structured-contents/'
			)
			.then(function (response) {
				dumpResponse(response);

				return response.text();
			})
			.then(function (text) {
				appendResult(pre(text));
			})
			.catch(function (error) {
				console.log('caught', error);
			});
	});

	button('blob', function () {
		client
			.fetch('/image/layout_set_logo')
			.then(function (response) {
				return response.blob();
			})
			.then(function (blob) {
				var url = URL.createObjectURL(blob);

				var img = document.createElement('img');

				img.src = url;

				appendResult(img);
			})
			.catch(function (error) {
				console.log('caught', error);
			});
	});

	button('graphql', function () {
		client
			.graphql('{documents(siteKey: "guest") {totalCount}}')
			.then(function (data) {
				appendResult(pre(JSON.stringify(data, null, 2)));
			})
			.catch(function (error) {
				console.log('caught', error);
			});
	});

	document
		.getElementById('debug')
		.addEventListener('change', function (event) {
			client.debug = event.target.checked;
		});

	var dropdownActive = false;

	document.getElementById('get').addEventListener('click', function (event) {
		var menu = document.getElementById('menu');

		if (dropdownActive) {
			dropdownActive = false;
			menu.classList.remove('show');
		} else {
			dropdownActive = true;
			menu.classList.add('show');
		}
	});

	document.addEventListener('click', function (event) {
		var element = event.target;

		if (element.classList.contains('get-item') && element.href) {
			var property = element.href.replace(/.*#/, '');

			var menu = document.getElementById('menu');

			menu.classList.remove('show');

			dropdownActive = false;

			client
				.get(property)
				.then(function (value) {
					appendResult(pre(JSON.stringify(value)));
				})
				.catch(function (error) {
					appendResult(error);
				});
		}
	});

	button('sign-out', function () {
		appendResult('navigating');
		client.navigate('/c/portal/logout');
	});
})();
