import React from 'react';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";
import FilterList from './component/FilterList.js';
import HomeNavbar from './component/HomeNavbar.js';
import TaskList from "./component/TaskList.js";
import dayjs from "dayjs";
import NewTask from './component/NewTask';
import { BrowserRouter as Router, Route, Switch, Redirect, } from 'react-router-dom';
import API from './component/API';
import { LoginForm, } from './component/LoginForm.js';

export const filters = [
  { id: 1, label: 'All' },
  { id: 2, label: 'Important' },
  { id: 3, label: 'Today', },
  { id: 4, label: 'Next 7 Days' },
  { id: 5, label: 'Private' }
];

function App() {
  const [show, setShow] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [retrieveTasks, setRetrieveTasks] = useState(false); //it's like 'dirty' on lessons examples. 
  const [currTask, setCurrTask] = useState({ id: NaN, description: "", isImportant: false, isPrivate: false, deadline: null});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user logged in
  const [user, setUser] = useState('');

  const handleShow = () => {
    setShow(show => !show);
  }

  const resetTask = () => {
    setCurrTask({ id: NaN, description: "", completed: false, isImportant: false, isPrivate: false, deadline: null});
  }

  const changeActiveFilter = (filterName) => {
    setActiveFilter(filterName);
    setRetrieveTasks(true);
    setMessage('');
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user.name);
        setLoggedIn(true);
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  const addTask = (description, deadline, isImportant, isPrivate) => {
    // On an INSERT, the 'id' will be filled automatically with an unused integer
    const newTask = {
      description: description,
      isImportant: isImportant,
      isPrivate: isPrivate,
      deadline: deadline,
      completed: false
    }

    const result = API.createTask(newTask);
    result.then((res) => {
      if (res.success) {
        // Retrieve the updated list of tasks from the server
        setMessage({ text: "Correctly inserted the task ", type: "success" });
        setRetrieveTasks(true);
      } else {
        setMessage({ text: "Error during creating the task", type: "danger" });
        console.error('addTask(): ', res.error);
      }
    });
  }

  const deleteTask = (task) => {
    const result = API.deleteTask(task.id);
    result.then(res => {
      if (res.success) {
        setMessage({ text: "Successfully deleted the task ", type: "success" });
        setRetrieveTasks(true);
      } else {
        setMessage({ text: "Error during deleting the task", type: "danger" });
        console.error(`deleteTask(${task.id})`, res.error);
      }
    })

  }

  const completeTask = (taskID, completed) => {
    const result = API.completeTask(taskID, completed);
    result.then(res => {
      if (res.success)
        setRetrieveTasks(true);
      else {
        console.error(`mark task error for ${taskID}`, res.error);
      }
    })
  }

  const updateTask = (taskID, description, deadline, isImportant, isPrivate, completed) => {
    const task = {
      id: taskID,
      description: description,
      completed: completed,
      deadline: deadline,
      isImportant: isImportant,
      isPrivate: isPrivate
    };

    const result = API.updateTask(task);

    result.then((res) => {
      if (res.success) {
        setRetrieveTasks(true);
        setMessage({ text: "Correctly updated the task ", type: "success" });
      } else {
        setMessage({ text: "Error during updating the task", type: "danger" });
        console.error("Error during updating " + task, res.error);
      }
    })

  }

  useEffect(() => {
    // Runs once after the initial rendering and 
    // after every rendering only if 'retrieveTasks' state changes 
    async function fetchTasks() {
      setLoading(true);
      const result = API.readTasks(activeFilter);
      result.then((res) => {
        if (res.success) {
          const tasks = res.data.map((t) => {
            return {
              id: t.id,
              description: t.description,
              deadline: t.deadline && dayjs(t.deadline),
              isImportant: t.important === 1,
              isPrivate: t.private === 1,
              completed: t.completed
            };
          });
          setTasks(tasks);
          setTimeout(() => setLoading(false), 300);
          setRetrieveTasks(false);
        } else {
          setMessage({ text: "Error during fetching the tasks", type: "danger" });
          setTasks(res.tasks);
          console.error('fetchTasks(): ', res.error);
        }
      });
    }
    if (retrieveTasks)
      fetchTasks();
  }, [retrieveTasks]); //warning on VS console: may we add 'activefilter' as a useEffect dependency?

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user.name);
      setMessage('');
    } catch (err) {
      setMessage({ text: err, type: "danger" }); //err: incorrect username and/or password
      console.error('doLogin(): ', err);
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setTasks([]);
    setUser('');
    setMessage('');
  }

  return (
    <Router>
      <Container fluid>
        <HomeNavbar show={handleShow} title='ToDo List' howToExpand='sm' username={user} doLogOut={doLogOut} />
        <Row>
          <Switch>
            <Route path="/login" render={() =>
              <>{loggedIn ? <Redirect to="/All" /> :
                <Col sm={6}>
                  <LoginForm login={doLogIn} />
                  {message && <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.text}</Alert>}
                </Col>}</>
            } />
            <Route path='/:filter' render={() => <>
              {!loggedIn ? <Redirect to="/login" /> : <>
                <Col className={'mt-2'}>
                  <FilterList show={show} filters={filters} changeActiveFilter={changeActiveFilter} />
                </Col>
                <Col sm={8}>
                  {loading ? <span>🕗 Please wait, loading your tasks... 🕗</span> : <>
                    <TaskList tasklist={tasks} setCurrentTask={setCurrTask} showForm={() => setShowNewTask(true)} deleteTask={deleteTask} completeTask={completeTask} />
                    {message && <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.text}</Alert>}
                  </>}
                </Col>
              </>}</>}>
            </Route>
            <Redirect to="/login" />
          </Switch>
        </Row>
        <Button size="lg" className={loggedIn ? "btn-circle" : "hide-elem"} onClick={() => { resetTask(); setShowNewTask(true); }}> + </Button>
        {showNewTask && <NewTask addTask={addTask} updateTask={updateTask} currTask={currTask} show={showNewTask} onHide={() => setShowNewTask(false)} setCurrentTask={setCurrTask} />}
      </Container>
    </Router>
  );
}

export default App;
