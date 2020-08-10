(function() {
  'use strict';

  console.log('app.js', window.__LIFERAY_REMOTE_WEB_APP_SDK__);

  try {
    __LIFERAY_REMOTE_WEB_APP_SDK__.openToast({
      message: 'Welcome to the danger zone',
      type: 'danger',
    });
  } catch (error) {
    console.log(error);
  }

  document.getElementById('hello').addEventListener('click', function() {
    try {
      __LIFERAY_REMOTE_WEB_APP_SDK__.openToast({
        message: 'Hello from the other side',
      });
    } catch (error) {
      console.log(error);
    }
  });

  document.getElementById('extend').addEventListener('click', function() {
    try {
      __LIFERAY_REMOTE_WEB_APP_SDK__.fetch(
        'http://0.0.0.0:8080/c/portal/extend_session'
      ).then(function () {
        console.log('extended');
      }).catch(function(error) {
        console.log('caught', error);
      });
    } catch (error) {
      console.log(error);
    }
  });

  document.getElementById('get').addEventListener('click', function() {
    // NOTE: Using "guest" as siteID is naughty, but I don't want to rely on the
    // potentially unstable numeric ID from my dev environment (20122).
    try {
      __LIFERAY_REMOTE_WEB_APP_SDK__.fetch(
        'http://0.0.0.0:8080/o/headless-delivery/v1.0/sites/guest/structured-contents/'
      ).then(function (response) {
        console.log('got response');
        return response.json();
      }).then(function (json) {
        console.log('got JSON', json);
      }).catch(function(error) {
        console.log('caught', error);
      });
    } catch (error) {
      console.log(error);
    }
  });
})();
