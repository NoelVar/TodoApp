import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    username: { type: String, reqired: true, unique: true },
    // SELECT WONT RETURN THE PASSOWRD OR EMAIL
    email: { type: String, reqired: true, unique: true, select: false },
    password: { type: String, reqired: true, select: false },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);