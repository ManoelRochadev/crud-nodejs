import express from "express";
import { User } from "./models/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { checkToken } from "./auth/check-token";

export const routes = express.Router()

// public route
routes.get('/', (req, res) => {
  res.send('Hello World!')
})

// private route
routes.get('/user/:id', checkToken, async (req: express.Request, res: express.Response) => {

  const id = req.params.id

  const user = await User.findById(id, '-password')

  if (!user) {
    return res.status(404).send({msg: 'Usuario não encontrado'})
  }

  res.send(user)

})

// Registering the user

routes.post('/auth/register', async (req, res) => {
  const { name, email, password, confirmpassword } = req.body

  if (!name) {
    return res.status(422).send({ error: 'O nome é obrigátorio' })
  }

  if (!email) {
    return res.status(422).send({ error: 'O email é obrigátorio' })
  }

  if (!password) {
    return res.status(422).send({ error: 'A senha é obrigátorio' })
  }

  if (password !== confirmpassword) {
    res.status(422).send({ error: 'As senhas não são iguais' })
  }

  const userExists = await User.findOne({ email: email })

  if (userExists) {
    return res.status(422).send({ error: 'Usuário já existe' })
  }

  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password: passwordHash,
  })

  try {
    await user.save()

    res.status(201).send({ msg: 'Usuário criado com sucesso' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Erro ao criar usuário' })
  }
})


// Login the user
routes.post('/auth/login', async (req, res) => {
  const {email, password} = req.body

  if (!email) {
    return res.status(422).send({ error: 'O email é obrigátorio' })
  }

  if (!password) {
    return res.status(422).send({ error: 'A senha é obrigátorio' })
  }

  const user = await User.findOne({ email: email })

  if (!user) {
    return res.status(404).send({ error: 'Usuário não existe' })
  }

  const checkPassword = await bcrypt.compare(password, user.password)

  if (!checkPassword) {
    return res.status(422).send({ error: 'Senha incorreta' })
  }

  try {
    const secret = process.env.SECRET

    const token = jwt.sign({ id: user._id }, secret!)

    res.status(200).send({ msg: 'Autenticação realizada com sucesso', token })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Erro ao fazer login' })
  }
})