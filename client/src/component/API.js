import dayjs from 'dayjs';

function readTasks(activeFilter) {
    let url = "";
    switch (activeFilter) {
        case "Important":
            url = "/api/important/";
            break;
        case "Private":
            url = "/api/private";
            break;
        case "Today":
            const now = dayjs().format("YYYY-MM-DD");
            url = `/api/deadline/${now}`;
            break;
        case "Next 7 Days":
            const start = dayjs().add(1, 'day').format("YYYY-MM-DD");
            const end = dayjs().add(7, 'day').format("YYYY-MM-DD");
            url = `/api/tasks?start=${start}&end=${end}`;
            break;
        default:
            url = "/api/tasks";
            break;
    }

    return fetch(url)
        .then((response) => {

            if (!response.ok) {
                // then() returns a rejected promise if something is thrown
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            return { success: true, data };
        })
        .catch(function (err) {
            return { success: false, error: err, tasks: [] };
        });
}


function createTask(task) {
    const url = '/api/tasks';

    const taskToSend = {
        description: task.description,
        important: task.isImportant ? 1 : 0,
        private: task.isPrivate ? 1 : 0,
        deadline: task.deadline ? dayjs(task.deadline).format('YYYY-MM-DD HH:mm') : null,
        completed: task.completed ? 1 : 0
    }

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToSend),
    })
        .then(response => {
            if (!response.ok) {
                // then() returns a rejected promise if something is thrown
                throw Error(response.statusText)
            }
            return { success: true, status: response.status };
        })
        .catch(function (err) {
            console.error('createTask(): ', err);
            return { success: false, error: err };
        });
}

function updateTask(task) {
    const url = `/api/tasks/${task.id}`;

    const taskToUpdate = {
        id: task.id,
        description: task.description,
        important: task.isImportant ? 1 : 0,
        private: task.isPrivate ? 1 : 0,
        deadline: task.deadline ? dayjs(task.deadline).format('YYYY-MM-DD HH:mm') : null,
        completed: task.completed ? 1 : 0
    }


    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToUpdate),
    })
        .then(response => {
            if (!response.ok) {
                // then() returns a rejected promise if something is thrown
                throw Error(response.statusText)
            }
            return { success: true, status: response.status };
        })
        .catch(function (err) {
            console.error('createTask(): ', err);
            return { success: false, error: err };
        });
}



function deleteTask(taskID) {
    const url = `/api/tasks/${taskID}`;

    return fetch(url, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return { success: true, status: response.status };
        })
        .catch(function (error) {
            console.error(`deleteTask(${taskID})`);
            return { success: false, error: error };
        });// console.log('createTask(): ', response.statusText);
}

function completeTask(taskID, completed) {
    const url = `/api/marktask/${taskID}`;
    const body = {
        id: taskID,
        completed: completed ? 1 : 0
    }
    return fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return { success: true, status: response.status };
    })
        .catch(function (error) {
            console.error(`complete task of ${taskID}`);
            return { success: false, error: error };
        })
}

//API che fa il login: fetch di un endpoint
async function logIn(credentials) {
    let response = await fetch('api/sessions', { // /sessions perché alla fine le sessioni è come se fossero una collezione
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials), //deve sempre mandare le credentials
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else { //gestisco l'errore: ho una stringa e voglio visualizzarla all'utente
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }

  async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
  }
  
  async function getUserInfo() {
    const response = await fetch('api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  //object with the error coming from the server
    }
  }

const API = { readTasks, updateTask, createTask, completeTask, deleteTask, logIn, logOut, getUserInfo };
export default API;