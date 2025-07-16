import express from "express";
// NOTE: easier to import all then one by one (However the u need to use ToDoController.function)
import * as ToDoController from "../controllers/toDo";

const router = express.Router();

router.get("/", ToDoController.getToDos);

router.get("/:todoId", ToDoController.getToDo);

router.post("/", ToDoController.createToDo);

router.patch("/:todoId", ToDoController.updateToDo);

router.patch("/:todoId/status", ToDoController.changeStatus);

router.delete("/:todoId", ToDoController.deleteTodo);

export default router;