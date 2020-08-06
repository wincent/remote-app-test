(function() {
  'use strict';

  console.log('app.js', window.__LIFERAY_REMOTE_WEB_APP_SDK__);

  // TODO show that this still works if we load first
  try {
    __LIFERAY_REMOTE_WEB_APP_SDK__.postMessage({key: 'value'});
  } catch (error) {
    console.log(error);
  }

  document.getElementById('hello').addEventListener('submit', function() {
    try {
      __LIFERAY_REMOTE_WEB_APP_SDK__.openToast({
        message: 'Hello from the other side',
      });
    } catch (error) {
      console.log(error);
    }
  });
})();
