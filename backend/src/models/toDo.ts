import { InferSchemaType, model, Schema } from "mongoose";

const toDoSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, require: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    completed: { type: Boolean, required: true}
}, { timestamps: true });

// NOTE:  Creates todo type by looking at the schema (for TS)
type ToDo = InferSchemaType<typeof toDoSchema>;

export default model<ToDo>("ToDo", toDoSchema);