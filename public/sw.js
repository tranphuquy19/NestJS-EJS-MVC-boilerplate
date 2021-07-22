self.addEventListener('push', (event) => {
    const data = event.data.json();

    if (!!event.origin && event.origin !== 'http://localhost:4000' ) // Compliant
        return;

    self.registration.showNotification(data.title, {
        ...data,
    });
});
