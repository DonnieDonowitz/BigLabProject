import { ListGroup, Container, Row, Col } from 'react-bootstrap';
import { formatDeadline } from './Task.js';
import 'font-awesome/css/font-awesome.min.css';

function StandardTask(props) {
    const task = props.task;
    const tid = "check-t" + task.id;
    const lbl = "custom-control-label" + (task.isImportant ? " important" : "");
    const deadline = formatDeadline(task);

    return (
        <ListGroup.Item as="li" key={task.id}>
            <Container>
                <Row>
                    <Col xs lg="7" className="justify-content-start">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" id={tid} className="custom-control-input" checked={props.task.completed ? true : false} onChange={() => props.completeTask(props.task.id, !props.task.completed)} />
                            <label className={lbl} htmlFor={tid}>
                                {task.description}
                            </label>
                        </div>
                    </Col>
                    <Col xs lg="3">
                        <small>
                            {deadline}
                        </small>
                    </Col>
                    <Col xs lg="1">
                        { /* <i className="fa fa-edit cursor-pointer" onClick={() => { props.showForm(true); props.setCurrentTask({ id: task.id, description: task.description, completed: task.completed, isImportant: task.isImportant, isPrivate: task.isPrivate, deadline: task.deadline ? dayjs(task.deadline) : dayjs() }); }} /> */ }
                        <i className="fa fa-edit cursor-pointer" onClick={() => { props.showForm(true); props.setCurrentTask({ id: task.id, description: task.description, completed: task.completed, isImportant: task.isImportant, isPrivate: task.isPrivate, deadline: task.deadline }); }} />
                    </Col>
                    <Col xs lg="1">
                        <i className="fa fa-trash-o cursor-pointer" onClick={() => props.deleteTask(task)} />
                    </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    );
}

export default StandardTask;
