const express = require('express')
const bcrypt = require('bcrypt')
const {initializeApp} = require('firebase/app')
const {getFirestore} = require('firebase/firestore')
require('dotenv/config')

// Configuracion de firebase
const firebaseConfig = {
    apiKey: "AIzaSyBESdXzEEgM03Y8d21ATXf_JNJ5gSyYp3E",
    authDomain: "back-firebase-f1f4f.firebaseapp.com",
    projectId: "back-firebase-f1f4f",
    storageBucket: "back-firebase-f1f4f.appspot.com",
    messagingSenderId: "831589755649",
    appId: "1:831589755649:web:beea6e73c1120ac6930900"
  }; 

  //Inicia BD 
  const firebase= initializeApp(firebaseConfig)
  const db = getFirestore()

  //Inicializar el servidor
  const app = express()

  const PORT = process.env.PORT||19000

  //ejecutamos el servidor
  app.listen(PORT, () =>{
    console.log(`Escuchando en el puerto:  ${PORT}`)
  })

