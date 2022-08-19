import { ListGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import PrivateTask from './PrivateTask.js';
import StandardTask from './StandardTask.js';
import { filters } from '../App.js';
import { Redirect } from 'react-router-dom';

function TaskList(props) {
    const location = useLocation();
    const filterLabelFromUrl = location.pathname.split('/')[1];

    const getFilterID = () => {
        const arrayWithID = filters.filter(fObj => fObj.label === filterLabelFromUrl);

        return arrayWithID[0] || {};
    };

    const filterID = location.state ? location.state.filterID : getFilterID().id;

    const tasks = filterID ? props.tasklist.map((task) => {
        if (!task.isPrivate) {
            return (<PrivateTask key={task.id} task={task} deleteTask={props.deleteTask} showForm={props.showForm} setCurrentTask={props.setCurrentTask} completeTask={props.completeTask} />);
        }
        else {
            return (<StandardTask key={task.id} task={task} deleteTask={props.deleteTask} showForm={props.showForm} setCurrentTask={props.setCurrentTask} completeTask={props.completeTask} />);
        }
    }) : console.log('Error on URL. You will be redirected.');

    return (
        <>
            {
                filterID ?
                    <>
                        <h3>{filterLabelFromUrl}</h3>
                        <ListGroup variant="flush" as="ul" id="list-tasks"> {tasks} </ListGroup>
                    </> : <Redirect to='/All' />
            }
        </>
    );
}

export default TaskList;
