import musicDBCloud from "../music-db/music-db-cloud.js";

const notificationButton = document.getElementById('notificationButton');
if('Notification' in window && 'serviceWorker' in navigator) {
    notificationButton.addEventListener('click', () => {
        console.log('Permission', Notification.permission)
        switch(Notification.permission) {
            case 'default':
                requestUserPermission();
                break;
            case 'granted':
                // displayNotification();
                configurePushSubscription();

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
            // displayNotification();
            configurePushSubscription();
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
        ],
        data: {
            id: 'he1',
            name: 'sangeetha',
            age: 24
        }
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

async function configurePushSubscription() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const pushManager = registration.pushManager;
        let subscription = await pushManager.getSubscription();
        if( subscription == null ) {
            const publicKey = 'BBRx89iM8eA3q0XC5HqzR5BjOy8O2tcRbro4ZA1SUwigaLXYld5O05wycy2V8OdwzwtTiWmi6t6zIfWzSRuNlrg'
            const options = {
                userVisibleOnly: true,
                applicationServerKey: publicKey
            };

            subscription = await pushManager.subscribe(options);
            await musicDBCloud.open();
            await musicDBCloud.subscribe(subscription);
            console.log('Saved subscription')
        }
    }
    catch(error) {
        console.log('Subscription Error', error)
    }
}