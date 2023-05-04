import { prop, getModelForClass } from '@typegoose/typegoose'

export class TodoSchema {
  @prop()
    title: string

  @prop()
    completed: boolean
}

const Todo = getModelForClass(TodoSchema)
export default Todo
