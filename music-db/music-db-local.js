
//IndexedDB
class MusicDB {
    constructor() {
        this.db = null;
        this.isAvailable = false;
    }

    open() {
        return new Promise((resolve, reject) => {
            if ('indexedDB' in window) {
                const request = indexedDB.open('Music', 1)

                //handles error when opening/creating database
                request.onerror = (event) => {
                    reject(event.target.error.message);
                }

                //handles success when opening/creating database
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    if (db) {
                        this.db = db;
                        this.isAvailable = true;
                        resolve();
                    } else {
                        reject('The database is not available')
                    }

                }

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    const objectStore = db.createObjectStore('MusicList', { keyPath: 'id' });

                    objectStore.createIndex('songTitle', 'songTitle');
                    objectStore.createIndex('songArtist', 'songArtist')
                }
            }
            else {
                reject("Your browser doesn't support IndexedDB.")
            }
        });

    }

    add(title, artist) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database Not Opened!')
            }

            const transaction = this.db.transaction(['MusicList'], 'readwrite');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            }

            //store handlers
            const store = transaction.objectStore('MusicList');
            const storeRequest = store.add({
                id: Date.now(),
                songTitle: title,
                songArtist: artist,
                songLike: 0
            });
            storeRequest.onerror = (event) => {
                reject(event.target.error.message);
            }
            storeRequest.onsuccess = (event) => {
                resolve();
            }
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            console.log('Get All', this.isAvailable)
            if (!this.isAvailable) {
                reject('Database not found');
            }
            const transaction = this.db.transaction(['MusicList'], 'readonly');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            };

            const store = transaction.objectStore('MusicList');
            const request = store.getAll();
            request.onerror = (event) => {
                reject(event.target.error.message);
            }

            request.onsuccess = (event) => {
                resolve(event.target.result);
            }
        });

    }

    update(updatedSong) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database Not Opened!')
            }

            const transaction = this.db.transaction(['MusicList'], 'readwrite');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            }

            //store handlers
            const store = transaction.objectStore('MusicList');
            const storeRequest = store.put(updatedSong);
            storeRequest.onerror = (event) => {
                reject(event.target.error.message);
            }
            storeRequest.onsuccess = (event) => {
                resolve();
            }
        })
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database Not Opened!')
            }

            const transaction = this.db.transaction(['MusicList'], 'readwrite');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            }

            //store handlers
            const store = transaction.objectStore('MusicList');
            const storeRequest = store.delete(id);
            storeRequest.onerror = (event) => {
                reject(event.target.error.message);
            }
            storeRequest.onsuccess = (event) => {
                resolve();
            }
        });
    }
}
export default new MusicDB();