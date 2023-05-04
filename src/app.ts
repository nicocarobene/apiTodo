/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { type User } from '../types'
import UserModel from '../ModelDB/User'
import bcrypt from 'bcrypt'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { UseStractor } from '../Middleware/UseStractor'
import Todo from '../ModelDB/Todo'
import mongoose from 'mongoose'
require('./mongo')

const app = express()

app.use(express.json())
app.use(cors())

app.post('/', async (req, resp) => {
  const { username, name, email, password } = req.body

  if (!(username && name && password)) {
    return resp.status(400).json({ error: 'the user required a username, name and password, pleas fill de input required' })
  }
  const isAlreadyuser = await UserModel.findOne({ username })
  if (isAlreadyuser) {
    return resp.status(400).json({ error: 'user is already exist' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const newuser: User = {
    username,
    name,
    email,
    passwordHash
  }
  console.log(newuser)
  const user = await UserModel.create(newuser)
  user.save()
    .then(savedUser => {
      const { email, name, passwordHash, _id, username } = savedUser
      const newuser = {
        email,
        name,
        password: passwordHash,
        id: _id,
        username
      }
      resp.json(newuser)
    })
    .catch(e => { console.log(e) })
})
app.post('/toDo', UseStractor, async (req: any, resp) => {
  const { title, completed } = req.body
  const { username } = req
  const user = await UserModel.findOne({ username })
  if (!user) return resp.status(400).json({ error: 'something west wrong' })

  const newTodo = await Todo.create({
    title,
    completed
  })
  const safeTodo = await newTodo.save()
  const todoResp = {
    id: safeTodo._id,
    title: safeTodo.title,
    completed: safeTodo.completed
  }

  user.todos = [...user.todos, safeTodo._id]
  console.log(safeTodo._id)

  await user.save()

  resp.json(todoResp)
})
app.get('/togglecompleted/:id', UseStractor, async (req, resp) => {
  const { id } = req.params
  const todo = await Todo.findById(new mongoose.Types.ObjectId(id))
  if (!todo) return resp.status(400).json({ error: 'the id is wrong' })
  todo.completed = !todo.completed
  await todo.save()
  resp.status(200).json(todo)
})

app.delete('/:id', UseStractor, async (req: any, resp) => {
  const { username } = req

  if (!username) return resp.status(400).json('username or password is invalideted')
  const { id } = req.params

  if (!id) return resp.status(400).json({ error: 'id is required' })

  const idTodelete = await Todo.findOneAndDelete(new mongoose.Types.ObjectId(id))

  resp.status(200).json(idTodelete)
})

app.post('/login', async (req, resp) => {
  const { username, password } = req.body
  if (!username && !password) return resp.status(400).json({ Error: "username and password don't exist" })

  const user = await UserModel.findOne({ username })
    .populate('todos', {
      title: 1,
      completed: 1
    })

  if (user === null) {
    return resp.status(400).json({
      error: 'Invalid credential'
    })
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return resp.status(400).json({
      error: 'invalid user or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET_WORD as string, {
    expiresIn: 60 * 60 * 24 * 7
  })
  const todos = user.todos.map((todo: any) => {
    return {
      id: todo._id,
      title: todo.title,
      completed: todo.completed
    }
  })

  resp.status(200).json({
    username: user.username,
    name: user.name,
    todos,
    token,
    message: 'todo salio perfecto'
  })
})

export default app