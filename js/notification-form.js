import musicDBCloud from "../music-db/music-db-cloud.js";

const notificationButton = document.getElementById('notification-button');
const showButton = document.getElementById('show-button');

showButton.addEventListener('click', () => {
    console.log('entering on clicking show')
    showNotification();
});

if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') { 
            configurePushSubscription() 
        }
    })
   
    //     console.log('Permission', Notification.permission)
    //     switch (Notification.permission) {
    //         case 'default':
    //             requestUserPermission();
    //             break;
    //         case 'granted':
    //             showNotification();
    //             break;
    //         case 'denied':
    //             notificationNotAllowed();
    //             break;
    //     }
} else {
    notificationNotAllowed();
}
function showNotification() {
    let message = []
    const notificationTitleInput = document.getElementById("notification-title");
    const notificationBodyInput = document.getElementById("notification-body");

    // Validation checks
    const notificationTitle = notificationTitleInput.value.trim();
    const notificationBody = notificationBodyInput.value.trim();

    if (notificationTitle === '' || notificationBody === '') {
        message.push('Title and Artist fields are required.')
    }
    displayNotification(notificationTitle, notificationBody)
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

function displayNotification(title, body) {
    const options = {
        body: body,
        icon: '/images/logo.png',
        actions: [
            {
                action: 'confirm',
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
    navigator.serviceWorker.ready
        .then((registration) => {
            registration.showNotification(title, options)
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
        if (subscription == null) {
            const publicKey = 'BBRx89iM8eA3q0XC5HqzR5BjOy8O2tcRbro4ZA1SUwigaLXYld5O05wycy2V8OdwzwtTiWmi6t6zIfWzSRuNlrg'
            const options = {
                userVisibleOnly: true,
                applicationServerKey: publicKey
            };

            subscription = await pushManager.subscribe(options);
            await musicDBCloud.open();
            await musicDBCloud.subscribe(subscription);
            console.log('Saved subscription')
        } else {
            notificationButton.style.display = 'none';
        }
    }
    catch (error) {
        console.log('Subscription Error', error)
    }
}