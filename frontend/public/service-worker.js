/* eslint-disable no-restricted-globals */
self.addEventListener("push", (e) => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    image:
      data.image ??
      "https://cdn.pixabay.com/photo/2015/12/16/17/41/bell-1096280_1280.png",
    icon:
      data.icon ??
      "https://cdn.pixabay.com/photo/2015/12/16/17/41/bell-1096280_1280.png",
  });
});
