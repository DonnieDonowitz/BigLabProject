# BigLab 2 - Class: 2021 AW1 A-L

## Team name: nullpointerexception

Team members:
* s282049 Alessandro Bacci
* s290159 Angelo Marino Carmollingo
* s287113 Margherita Del Balio
* s188295 Giorgio Bar

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

# List Tasks

URL: `/api/tasks/`

Mehod: GET

Description: Get all the tasks in the database.

Request sample: 

```
GET /api/tasks HTTP/1.1
Host: localhost
```

Request body: None

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of object, each describing a task.

Response sample: 

```
[{
  "id": 2,
  "description": "Go for a walk",
  "important": 1,
  "private": 1,
  "deadline": "2021-04-14 08:30",
  "completed": 1,
  "user": 1
}, 
...
]
```

# Get a Task (by ID)

URL: `/api/tasks/<id>`

Mehod: GET

Description: Get the task (if exists) with the id equal to the parameter `<id>` in the database.

Request sample: 

```
GET /api/tasks/<id> 
HTTP/1.1 Host: localhost
```

Request body: None

Response: `200 OK` (success), `404 Not Found` (wrong id) or `500 Internal Server Error` (generic error).

Response body: An object describing the task.

Response sample: 

```
[{
  "id": 2,
  "description": "Go for a walk",
  "important": 1,
  "private": 1,
  "deadline": "2021-04-14 08:30",
  "completed": 1,
  "user": 1
}]
```

# Get all the Tasks by a filter (deadline)

URL: `/api/deadline/<deadline>`

Mehod: GET

Description: Get all the tasks with deadline equal to the parameter `<deadline>` in the database.

Request sample: 

```
GET /api/deadline/<deadline> 
HTTP/1.1 Host: localhost
```

Request body: None

Response: `200 OK` (success), `404 Not Found` (wrong deadline) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

Response sample: 

```
[{
  "id": 2,
  "description": "Go for a walk",
  "important": 1,
  "private": 1,
  "deadline": "2021-04-14 08:30",
  "completed": 1,
  "user": 1
  },
  ...
]
```

# Get all the Tasks by a filter (important)

URL: `/api/important`

Mehod: GET

Description: Get all the important tasks in the database (important attribute set to 1).

Request sample: 

```
GET /api/important 
HTTP/1.1 Host: localhost
```

Request body: None

Response: `200 OK` (success), `404 Not Found` (none of the task is important) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

Response sample: 

```
[{
  "id": 2,
  "description": "Go for a walk",
  "important": 1,
  "private": 1,
  "deadline": "2021-04-14 08:30",
  "completed": 1,
  "user": 1
  },
  ...
]
```

# Get all the Tasks by a filter (private)

URL: `/api/private`

Mehod: GET

Description: Get all the private tasks in the database (private attribute set to 1).

Request sample: 

```
GET /api/private 
HTTP/1.1 Host: localhost
```

Request body: None

Response: `200 OK` (success), `404 Not Found` (none of the task is private) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

Response sample: 

```
[{
  "id": 2,
  "description": "Go for a walk",
  "important": 1,
  "private": 1,
  "deadline": "2021-04-14 08:30",
  "completed": 1,
  "user": 1
  },
  ...
]
```

# Create a new Task

URL: `/api/tasks`

Mehod: POST

Description: Create a new task in the database.

Request sample: 

```
POST /api/tasks HTTP/1.1
Host: localhost
Content-Type: application/json
Content-Length: 127
```

Request body: 

```
{
  "description": "Watch Breaking Bad",
  "important": 1,
  "private": 1,
  "deadline": "2021-12-24 08:30",
  "completed": 1
}
```

Response: `201 Created` (success), `422 Unprocessable Entity` (validation error) or `503 Service Unvailable` (database error).

Response body: None

# Update a Task

URL: `/api/tasks`

Mehod: PUT

Description: Update an existing task in the database.

Request sample: 

```
POST /api/tasks HTTP/1.1
Host: localhost
Content-Type: application/json
Content-Length: 127
```

Request body: 

```
{
  "id": 2
  "description": "Go For A Walk",
  "important": 0,
  "private": 1,
  "deadline": "2021-12-24 08:30",
  "completed": 0
}
```

Response: `200 OK` (success), `404 Not Found` (wrong id), `422 Unprocessable Entity` (validation error) or `503 Service Unvailable` (database error).

Response body: None

# Complete/uncomplete a Task (by ID)

URL: `/api/marktask/:id`

Mehod: PUT

Description: Setting the completed task attribute to its opposite (if completed = 0, then it will be 1 and viceversa).

Request sample: 

```
PUT /api/marktask/10 HTTP/1.1
Host: localhost
Content-Type: application/json
Content-Length: 0
```

Request body: None

Response: `200 OK` (success), `404 Not Found` (wrong id) or `503 Service Unvailable` (database error).

Response body: None

# Delete a Task (by ID)

URL: `/api/tasks/:id`

Mehod: DELETE

Description: Delete the task in the database with id attribute matching `<id>` parameter.

Request sample: 

```
DELETE /api/tasks/10 HTTP/1.1
Host: localhost
```

Request body: None

Response: `204 No Content` (success), `404 Not Found` (wrong id) or `503 Service Unvailable` (database error).

Response body: None

## Usernames and Passwords List

|User ID|Username|Password(plain text)|
|---|---|---|
|1|john.doe@polito.it|student1234|
|2|mario.rossi@gmail.com|student|
|3|marghe.rita@gmail.com|pizzamargherita|
