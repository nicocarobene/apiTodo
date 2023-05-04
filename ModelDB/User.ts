import { prop, getModelForClass, type Ref } from '@typegoose/typegoose'
import { TodoSchema } from './Todo'

export class UserSchema {
  @prop({ required: true, unique: true })
    username: string

  @prop({ required: true })
    name: string

  @prop({ required: true, unique: true })
    email: string

  @prop({ ref: () => TodoSchema })
    todos: Array<Ref<TodoSchema>>

  @prop({ required: true, unique: true })
    passwordHash: string
}

const UserModel = getModelForClass(UserSchema)
export default UserModel

// userSchema.set('toJSON', {
//   transform: (document :any, returnedObject: any) => {
//     returnedObject.id = returnedObject._id
//     delete returnedObject._id
//     delete returnedObject.__v
//     delete returnedObject.passwordHash
//   }
// }
// )

// const UserDB = model('User', userSchema)
