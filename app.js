(function () {
	'use strict';

	var SDK = window.__LIFERAY_REMOTE_WEB_APP_SDK__;

	if (!SDK) {
		console.error('No __LIFERAY_REMOTE_WEB_APP_SDK__ on window');

		return;
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
				console.log('got response');

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
				console.log('got response');

				return response.text();
			})
			.then(function (text) {
				console.log('got text', text);
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
