const express = require('express')
const bcrypt = require('bcrypt')
const {initializeApp} = require('firebase/app')
const {getFirestore, collection , getDoc, doc, setDoc} = require('firebase/firestore')
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

  app.use(express.json())

  //Ruta para las peticiones
  app.post('/registro', (req, res) =>{
    const{ name, lastname, email, password, number} = req.body

    //Validaciones de los datos
    if(name.length <= 3){
      res.json({
        'alert': 'Nombre requiere minimo 3 caracters'
      })
    }else if (lastname.length <3){
      res.json({
        'alert': 'Apellido requiere minimo 3 caracteres'
      })
    }else if (!email.length){
      res.json({
        'alert': 'Debes escribir correo electronico'
      })
    }else if (password.length < 8){
      res.json({
        'alert': 'Password requiere minimo 8 caracteres'
      })
    }
    else if (!Number(number) || number.length <10){
      res.json({
        'alert': 'Introduce un numero de telefono correcto'
      })
    } else {
      const users = collection(db, 'users')

      getDoc(doc(users,email)).then(user =>{
        if(user.exists()){
          res.json({
            'alert': 'El correo ya existe'
          })
        }else{
          bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(password, salt, (err, hash) =>{
              req.body.password = hash

              //Guardar en la base de datos
              setDoc(doc(users, email), req.body).then(() =>{
                res.json({
                  'alert': 'success'
                })
              })
            })
          })
        }
      })
    }
  })

   app.get('/usuarios', (req, res) =>{
    const users = collection(db, 'users')
    console.log('Usuarios', users)
    res.json({
      'alert': 'success',
      users
    })
   })
  const PORT = process.env.PORT||19000

  //ejecutamos el servidor
  app.listen(PORT, () =>{
    console.log(`Escuchando en el puerto:  ${PORT}`)
  })

