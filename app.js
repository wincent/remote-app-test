(function () {
	'use strict';

	var SDK = window.__LIFERAY_REMOTE_WEB_APP_SDK__;

	if (!SDK) {
		console.error('No __LIFERAY_REMOTE_WEB_APP_SDK__ on window');

		return;
	}

	SDK.get('css')
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

	function appendResult(element) {
		var results = document.getElementById('results');

		var row = document.createElement('div');

		row.classList.add('row');

		row.appendChild(element);

		results.appendChild(row);

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

	SDK.openToast({
		message: 'Welcome to the danger zone',
		type: 'danger',
	});

	button('hello', function () {
		SDK.openToast({
			message: 'Hello from the other side',
		});
	});

	button('extend', function () {
		SDK.fetch('http://0.0.0.0:8080/c/portal/extend_session')
			.then(function () {
				console.log('extended');
			})
			.catch(function (error) {
				console.log('caught', error);
			});
	});

	button('json', function () {
		// NOTE: Using "guest" as siteID is naughty, but I don't want to rely on the
		// potentially unstable numeric ID from my dev environment (20122).
		SDK.fetch(
			'http://0.0.0.0:8080/o/headless-delivery/v1.0/sites/guest/structured-contents/'
		)
			.then(function (response) {
				dumpResponse(response);

				return response.json();
			})
			.then(function (json) {
				console.log('got JSON', json);
			})
			.catch(function (error) {
				console.log('caught', error);
			});
	});

	button('text', function () {
		// NOTE: Using "guest" as siteID is naughty, but I don't want to rely on the
		// potentially unstable numeric ID from my dev environment (20122).
		SDK.fetch(
			'http://0.0.0.0:8080/o/headless-delivery/v1.0/sites/guest/structured-contents/'
		)
			.then(function (response) {
				dumpResponse(response);

				return response.text();
			})
			.then(function (text) {
				console.log('got text', text);
			})
			.catch(function (error) {
				console.log('caught', error);
			});
	});

	button('blob', function () {
		SDK.fetch('/image/layout_set_logo')
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
		SDK.graphql('{documents(siteKey: "guest") {totalCount}}')
			.then(function (data) {
				console.log('got data', data);
			})
			.catch(function (error) {
				console.log('caught', error);
			});
	});
})();
