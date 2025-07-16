import { Card } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { Todo as TodoModel } from "../../models/todo";
import styles from '../../styles/Todo.module.css';
import styleUtils from '../../styles/utils.module.css';
import { formatDate } from "../../utils/formatDate";

interface TodoProps {
    todo: TodoModel,
    onTodoClicked: (todo: TodoModel) => void,
    onDeleteTodoClicked: (todo: TodoModel) => void,
    onStatusChange: (todo: TodoModel) => void,
    className?: string,
}

const NotCompleteCard = ({ todo, onTodoClicked, onDeleteTodoClicked, onStatusChange, className }: TodoProps) => {
    const {
        title,
        content,
        completed,
        createdAt,
        updatedAt,
    } = todo;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card
            className={`${styles.todoCard} ${className}`}
            onClick={() => onTodoClicked(todo)}
        >
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    <input
                        type="checkbox"
                        checked={completed}
                        onClick={(e) => {
                            /**
                             * TODO: Add onCheckChange
                             */
                            onStatusChange(todo);
                            e.stopPropagation();
                        }}
                    >
                    </input>
                    {title}
                    <MdDelete
                        className={`ms-auto ${styles.bin}`}
                        onClick={(e) => {
                            onDeleteTodoClicked(todo);
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {content}
                </Card.Text>
            </Card.Body>
            <Card.Footer className={styles.muted}>
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    );
}

export default NotCompleteCard;