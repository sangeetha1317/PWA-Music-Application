import musicDBCloud from "../music-db/music-db-cloud.js";

const notificationButton = document.getElementById('notification-button');
const notificationForm = document.getElementById('notification-form');

if ('Notification' in window && 'serviceWorker' in navigator) {
    checkForSubscription()
    notificationButton.addEventListener('click', () => {
        switch (Notification.permission) {
            case 'default':
                requestUserPermission();
                break;
            case 'granted':
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


function checkForSubscription() {
    if (Notification.permission == 'granted') {
        notificationForm.style.display = 'block';
        notificationButton.style.display = 'none';
    } else {
        notificationForm.style.display = 'none';
        notificationButton.style.display = 'block';
        if(Notification.permission == 'denied') {
            notificationButton.disabled = true;
            notificationButton.classList.add('disabled');
        }
    }
}

function requestUserPermission() {
    Notification.requestPermission()
        .then((permission) => {
            if (permission === 'granted') {
                configurePushSubscription();

            } else {
                notificationNotAllowed();
            }

        });
}

function notificationNotAllowed() {
    console.log('Notification not allowed');
    notificationButton.disabled = true;
    notificationButton.classList.add('disabled');
}

async function configurePushSubscription() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const pushManager = registration.pushManager;
        let subscription = await pushManager.getSubscription();
        if (subscription == null) {
            const publicKey = 'BBRx89iM8eA3q0XC5HqzR5BjOy8O2tcRbro4ZA1SUwigaLXYld5O05wycy2V8OdwzwtTiWmi6t6zIfWzSRuNlrg'
            const options = {
                userVisibleOnly: true,
                applicationServerKey: publicKey
            };

            subscription = await pushManager.subscribe(options);
            await musicDBCloud.open();
            await musicDBCloud.subscribe(subscription);
            notificationForm.style.display = "block"
            notificationButton.style.display = "none"
            console.log('Saved subscription')

        }
    }
    catch (error) {
        console.log('Subscription Error', error)
    }
}