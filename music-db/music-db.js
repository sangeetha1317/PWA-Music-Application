import dbOnline from './music-db-cloud.js'
import dbOffline from './music-db-local.js'

class MusicDB {
    constructor() {
        this.dbOnline = dbOnline
        this.dbOffline = dbOffline
        this.swController = null
        this.swRegistration = null

    }

    open() {
        return new Promise((resolve, reject) => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then((registration) => {
                    if ('active' in registration && 'sync' in registration) {
                        this.dbOffline.open().then(() => {
                            this.swController = registration.active;
                            this.swRegistration = registration;
                            this.dbOnline.open().then(resolve()).catch(reject(err));
                        }).catch((err) => {
                            this.dbOnline.open().then(resolve()).catch(reject(err));
                        })
                    }
                    else {
                        this.dbOnline.open().then(resolve()).catch(reject(err));
                    }
                })
            }
            else {
                this.dbOnline.open().then(resolve()).catch(reject(err));
            }
        })
    }

    add(title, artist) {
        if (navigator.onLine) {
            return this.dbOnline.add(title, artist);
        } else {
            console.log('Offline')
            this.swRegistration.sync.getTags()
                .then((tags) => {
                    if (!tags.includes('add-music')) {
                        this.swRegistration.sync.register('add-music')
                    }
                })
            return this.dbOffline.add(title, artist);
        }
    }

    getAll() {
        if( navigator.onLine) {
            return this.dbOnline.getAll()
        }
        else {
            return new Promise((resolve, reject) => {
                reject('You must be connected to web the data')
            })
        }
    }

    update(updatedsong) {

    }

    delete(id) {
        return this.dbOffline.delete(id)
    }
}
export default new MusicDB();