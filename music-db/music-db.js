import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";



class MusicDB {
    constructor() {
        this.db = null
        this.isAvailable = false;
    }

    open() {
        return new Promise((resolve, reject) => {
            try {
                const firebaseConfig = {
                    apiKey: "AIzaSyCMvhDKvsWFz4q9YF0eA9FAZB1R12yIkAU",
                    authDomain: "my-pwa-51635.firebaseapp.com",
                    projectId: "my-pwa-51635",
                    storageBucket: "my-pwa-51635.appspot.com",
                    messagingSenderId: "56484736332",
                    appId: "1:56484736332:web:c1f8f57c0abf9836d233e9"
                };

                // Initialize Firebase
                const app = initializeApp(firebaseConfig);

                // Initialize Cloud Firestore and get a reference to the service
                const db = getFirestore(app);

                if (db) {
                    this.db = db
                    this.isAvailable = true
                    resolve()
                } else {
                    reject('The database is not available');
                }

            } catch (error) {
                reject(error.message);
            }
        })
    }

    add(title, artist) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database Not Opened!')
            }

            const song = {
                id: Date.now(),
                songTitle: title,
                songArtist: artist,
                songLike: 0
            };

            const dbCollection = collection(this.db, 'MusicList');
            addDoc(dbCollection, song)
                .then((docRef) => {
                    resolve()
                })
                .catch((error) => {
                    reject(error.message);
                })
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database Not Opened!')
            }
            const dbCollection = collection(this.db, 'MusicList');
            getDocs(dbCollection)
                .then((querySnapshot) => {
                    const result = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        data.id = doc.id;
                        result.push(data);
                    })
                    resolve(result)
                }).catch((error) => {
                    reject(error.message);
                })

        });

    }

    update(updatedSong) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database Not Opened!')
            }
            const docRef = doc(this.db, 'MusicList', updatedSong.id);
            updateDoc(docRef, { songLike: updatedSong.songLike })
                .then(() => {
                    resolve()
                }).catch((error) => {
                    reject(error.message);
                })

        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database Not Opened!')
            }
            const docRef = doc(this.db, 'MusicList', id);
            deleteDoc(docRef)
                .then(() => {
                    resolve()
                }).catch((error) => {
                    reject(error.message);
                })

        });
    }
}
export default new MusicDB();