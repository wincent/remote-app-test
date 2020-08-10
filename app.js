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
})();
