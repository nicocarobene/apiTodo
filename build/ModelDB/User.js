"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const Todo_1 = require("./Todo");
class UserSchema {
}
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => Todo_1.TodoSchema }),
    __metadata("design:type", Array)
], UserSchema.prototype, "todos", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "passwordHash", void 0);
exports.UserSchema = UserSchema;
const UserModel = (0, typegoose_1.getModelForClass)(UserSchema);
exports.default = UserModel;
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
