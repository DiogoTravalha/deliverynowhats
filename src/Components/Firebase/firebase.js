import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: 'AIzaSyCz_1gy2UKe2a6EN0mEQGOSCU2nmE08uGo',
  authDomain: 'sistemadelivery-ac5c5.firebaseapp.com',
  projectId: 'sistemadelivery-ac5c5',
  storageBucket: 'sistemadelivery-ac5c5.appspot.com',
  messagingSenderId: '574075747094',
  appId: '1:574075747094:web:d24ec1fc53d470fac66e37',
  measurementId: 'G-60SWDWP6P8',
}

firebase.initializeApp(firebaseConfig)

export default firebase
