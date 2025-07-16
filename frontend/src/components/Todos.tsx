import { Todo as TodoModel } from "../models/todo";
import CompletedCard from './card/CompletedCard';
import NotCompleteCard from './card/NotCompleteCard';

interface TodoProps {
    todo: TodoModel,
    onTodoClicked: (todo: TodoModel) => void,
    onDeleteTodoClicked: (todo: TodoModel) => void,
    onStatusChange: (todo: TodoModel) => void,
    className?: string,
}

const Todo = ({ todo, onTodoClicked, onDeleteTodoClicked, onStatusChange, className }: TodoProps) => {
    const {
        completed,
    } = todo;


    return (
        <>
            {completed
                ? <CompletedCard
                    todo={todo}
                    onTodoClicked={onTodoClicked}
                    onDeleteTodoClicked={onDeleteTodoClicked}
                    onStatusChange={onStatusChange}
                    className={className} />
                : <NotCompleteCard
                    todo={todo}
                    onTodoClicked={onTodoClicked}
                    onDeleteTodoClicked={onDeleteTodoClicked}
                    onStatusChange={onStatusChange}
                    className={className} />

            }
        </>

    )
}

export default Todo;