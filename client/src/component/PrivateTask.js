import { ListGroup, Container, Row, Col } from 'react-bootstrap';
import { formatDeadline } from './Task.js';
import 'font-awesome/css/font-awesome.min.css';

function PrivateTask(props) {
    const task = props.task;
    const tid = "check-t" + task.id;
    const lbl = "custom-control-label" + (task.isImportant ? " important" : "");
    const deadline = formatDeadline(task);

    return (
        <ListGroup.Item as="li">
            <Container >
                <Row>
                    <Col xs lg="6" className="justify-content-start">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" id={tid} className="custom-control-input" checked={props.task.completed ? true : false} onChange={() => props.completeTask(props.task.id, !props.task.completed)} />
                            <label className={lbl} htmlFor={tid}>
                                {task.description}
                            </label>
                        </div>
                    </Col>
                    <Col xs lg="1" className="justify-content-center">
                        <div>
                            <svg className="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
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

export default PrivateTask;
