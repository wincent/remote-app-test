console.log('app.js', window.__LIFERAY_REMOTE_WEB_APP_SDK__);

try {
  __LIFERAY_REMOTE_WEB_APP_SDK__.postMessage({key: 'value'});
} catch (error) {
  console.log(error);
}
