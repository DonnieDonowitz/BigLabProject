import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import dayjs from 'dayjs';

function NewTask(props) {
    const {onHide} = props;
    const [description, setDescription] = useState(props.currTask.description);
    const [deadlineDate, setDeadlineDate] = useState( (props.currTask && props.currTask.deadline) ? props.currTask.deadline.format('YYYY-MM-DD') : '');
    const [deadlineTime, setDeadlineTime] = useState( (props.currTask && props.currTask.deadline) ? props.currTask.deadline.format('HH:mm') : '');
    const [isImportant, setIsImportant] = useState(props.currTask.isImportant ? true : false);
    const [isPrivate, setIsPrivate] = useState(props.currTask.isPrivate ? true : false);
    const [validationErrors, setValidationErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const title = (props.currTask.id ? "Update current task" : "Insert new task");
    const buttonText = (props.currTask.id ? "Update" : "Insert");

    const handleSubmit = (event) => {
        event.preventDefault();

        const errorsFound = validateForm();

        if (Object.entries(errorsFound).length === 0) {
            let deadlineWithHour = null;
            if (deadlineDate !== "" && deadlineTime && deadlineTime !== "") {
              deadlineWithHour = dayjs(deadlineDate + "T" + deadlineTime);
            }
            else if (deadlineDate !== "") {
              deadlineWithHour = dayjs(deadlineDate + "T23:59");
            }

            if (props.currTask.id) {
                props.updateTask(props.currTask.id, description, deadlineWithHour, isImportant, isPrivate);
            } else {
                props.addTask(description, deadlineWithHour, isImportant, isPrivate);
                props.setCurrentTask({ id: NaN, description: "", isImportant: false, isPrivate: false, deadline: '' });
                initializeForm();
            }
            setSubmitted(true);
        } else {
            setValidationErrors(errorsFound);
        }
    }

    const validateForm = () => {
        const errorsFound = {};

        if (!description || description.trim() === '') {
            errorsFound.description = 'Please provide a description for the task';
        }

        if (deadlineDate !== "") {
            if (!dayjs(deadlineDate, 'YYYY-MM-DD', true).isValid()) {
                errorsFound.deadlineDate = 'Please provide a valid date';
            } else {
                if (dayjs(deadlineDate, 'YYYY-MM-DD').isBefore(dayjs(), 'day')) {
                    errorsFound.deadlineDate = 'The selected date is in the past';
                }
            }
        }

        return errorsFound;
    }

    const onChangeDescription = (value) => {
        setDescription(value);

        if ('description' in validationErrors) {
            const { description, ...rest } = validationErrors;
            setValidationErrors(rest);
        }

        if (submitted) setSubmitted(false);
    }

    const onChangeDeadlineDate = (value) => {
        setDeadlineDate(value);
        if (value === '' && deadlineTime !== '') {
            setDeadlineTime('');
        }

        if ('deadlineDate' in validationErrors) {
            const { deadlineDate, ...rest } = validationErrors;
            setValidationErrors(rest);
        }

        if (submitted) setSubmitted(false);
    }

    const onChangeDeadlineTime = (value) => {
        setDeadlineTime(value);

        if ('deadlineTime' in validationErrors) {
            const { deadlineTime, ...rest } = validationErrors;
            setValidationErrors(rest);
        }

        if (submitted) setSubmitted(false);
    }

    const initializeForm = () => {
        const currentTask = props.currTask;

        if (currentTask.id || currentTask.description !== description) {
            setDescription(currentTask.description);
            setDeadlineDate( (currentTask && currentTask.deadline) ? currentTask.deadline.format('YYYY-MM-DD') : '');
            setDeadlineTime( (currentTask && currentTask.deadline) ? currentTask.deadline.format('HH:mm') : '');
            setIsImportant(currentTask.isImportant);
            setIsPrivate(currentTask.isPrivate);
        }

        if (submitted) setSubmitted(false);
    };

    return (
        <><Modal show onShow={initializeForm} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="taskDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                onChange={(e) => onChangeDescription(e.target.value)}
                                type="text"
                                value={description}
                                placeholder="type a description for the new task"
                                isInvalid={'description' in validationErrors} />
                            <Form.Control.Feedback type='invalid'>
                                {validationErrors.description}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="taskDeadlineDate">
                            <Form.Label>Deadline Date</Form.Label>
                            <Form.Control
                                onChange={(e) => onChangeDeadlineDate(e.target.value)}
                                type="date"
                                value={deadlineDate}
                                placeholder="select a deadline for the new task"
                                isInvalid={'deadlineDate' in validationErrors} />
                            <Form.Control.Feedback type='invalid'>
                                {validationErrors.deadlineDate}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="taskDeadlineTime">
                            <Form.Label>Deadline Time</Form.Label>
                            <Form.Control type="time" name="deadlineTime" value={deadlineTime} onChange={(e) => onChangeDeadlineTime(e.target.value)} />
                        </Form.Group>

                        <Form.Check onChange={() => { setIsImportant(old => !old); if (submitted) setSubmitted(false); }} inline label="Important?" type="checkbox" checked={isImportant} id="taskImportant" />
                        <Form.Check onChange={() => { setIsPrivate(old => !old); if (submitted) setSubmitted(false); }} inline label="Private?" type="checkbox" checked={isPrivate} id="taskPrivate" />

                        <Form.Group controlId="submitButton" className="mt-2">
                            <Button className="btn" variant="primary" type="submit" onClick={handleSubmit} disabled={submitted}> {buttonText} </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn" onClick={props.onHide}> Close </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NewTask;