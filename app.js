(function() {
  'use strict';

  console.log('app.js', window.__LIFERAY_REMOTE_WEB_APP_SDK__);

  try {
    __LIFERAY_REMOTE_WEB_APP_SDK__.postMessage({key: 'value'});
    __LIFERAY_REMOTE_WEB_APP_SDK__.openToast({
      message: 'Hello from the other side',
    });
  } catch (error) {
    console.log(error);
  }
})();
