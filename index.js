const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const {initializeApp} = require('firebase/app')
const {getFirestore, collection , getDoc, doc, setDoc, getDocs, deleteDoc, updateDoc} = require('firebase/firestore')
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
  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  }
  //Inicia BD 
  const firebase= initializeApp(firebaseConfig)
  const db = getFirestore()

  //Inicializar el servidor
  const app = express()

  app.use(cors(corsOptions))
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
            message: "Usuarios",
            'alert': 'success',
            data
          })
        }else{
          bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(password, salt, (err, hash) =>{
              req.body.password = hash

              //Guardar en la base de datos
              setDoc(doc(users, email), req.body).then(()=>{
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

  app.get('/usuarios', async (req, res) =>{
    const colRef  = collection(db, 'users')
    const docsSnap = await getDocs(colRef)
    let data = []
    docsSnap.forEach(doc =>{
      data.push(doc.data())
    })
    res.json({
      message: "Usuarios",
      'alert': 'success',
      data
    })
   })

  app.post('/login', async(req,res) =>{
    let {email, password} = req.body

    if(!email.length || !password.length){
      return res.json({
        'alert': 'no se han recibido los datos correctamente'
      })
     }

  const users = collection(db, 'users')
  getDoc(doc(users, email))
  .then(user =>{
      if(!user.exists()){
        return res.json({
          'alert': 'Correo no registrado en la base de datos'
        })
      }else{
        bcrypt.compare(password, user.data().password, (error, result)=>{
          if(result){
            let data = user.data()
            res.json({
              'alert': 'Success',
              name: data.name,
              email: data.email
            })
          }else{
            return res.json({
              'alert': 'Password Inncorrecto'
            })
          }
        })
      }
   })
  })
  
  app.post('/delete', async (req, res) =>{
    let { email } = req.body

    deleteDoc(doc(collection(db, "users"), email))
    .then((response)=>{
      res.json({
        'alert': 'success'
      })
    })
    .catch((error) =>{
      res.json({
        'alert': error
      })
    })
  })

  app.post('/update', async (req, res) =>{
    const{ name, lastname, number, email} = req.body

    //Validaciones de los datos
    if(name.length <= 3){
      res.json({'alert': 'Nombre requiere minimo 3 caracters'})
    }else if (lastname.length <3){
      res.json({'alert': 'Apellido requiere minimo 3 caracteres'})
    }else if (!Number(number) || number.length <=10){
      res.json({'alert': 'Introduce un numero de telefono correcto'})
    } else {

      db.collection('users').doc(email)

      const updateData = {
        name, 
        lastname,
        number
      }

      updateDoc(doc(db, 'users'), updateData, email)
      .then((response)=>{
        res.json({
          'alert': 'success'
        })
      })
      .catch((error) =>{
        res.json({
          'alert': error
        })
      })
    }
  })
  
   
  const PORT = process.env.PORT||19000

  //ejecutamos el servidor
  app.listen(PORT, () =>{
    console.log(`Escuchando en el puerto:  ${PORT}`)
  })

