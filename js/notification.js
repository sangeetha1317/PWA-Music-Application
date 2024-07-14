const notificationButton = document.getElementById('notificationButton');
if('Notification' in window && 'serviceWorker' in navigator) {
    notificationButton.addEventListener('click', () => {
        console.log('Permission', Notification.permission)
        switch(Notification.permission) {
            case 'default':
                requestUserPermission();
                break;
            case 'granted':
                displayNotification();
                break;
            case 'denied':
                notificationNotAllowed();
                break;
        }
    });
} else {
    notificationNotAllowed();
}

function requestUserPermission() {
    Notification.requestPermission()
    .then((permission) => {
        if(permission === 'granted') {
            displayNotification();
        } else {
            notificationNotAllowed();
        }

    });
}

function displayNotification() {
    console.log('Show Notification')
    const options = {
        body: ' Thank you for subscribing to our notification',
        icon: '/images/logo.png',
        actions: [
            {
                action:'confirm',
                title: 'Okay'
            },
            {
                action: 'cancel',
                title: 'Cancel'
            }
        ]
    };
    // new Notification('Successfully subscribed!', options)
    navigator.serviceWorker.ready
    .then((registration) => {
        registration.showNotification('Successfully Subscribed!', options)
    })
}

function notificationNotAllowed() {
    console.log('Notification not allowed');
    notificationButton.disabled = true;
}