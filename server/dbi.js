'use strict';
const { raw } = require('express');
/* Database Interaction module */

const sqlite = require('sqlite3');

const db = new sqlite.Database('tasks.db', (err) => {
    if (err) throw err;
});

exports.listTasks = () => {
    return new Promise((res, rej) => {
        const sql = 'SELECT * FROM tasks';

        db.all(sql, [], (err, rows) => {
            if (err) {
                rej(err);
                return;
            }

            const tasks = rows.map((t) => (
                { id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }
            ));

            res(tasks);
        });
    });
};

exports.getTaskByID = (id, userId) => {
    return new Promise((res, rej) => {
        const sql = 'SELECT * FROM tasks WHERE id=? AND user=?';

        db.get(sql, [id, userId], (err, row) => {
            if (err) {
                rej(err);
                return;
            }

            if (row == undefined) {
                res({ error: 'Task not found' });
            } else {
                const task = { id: row.id, description: row.description, important: row.important, private: row.private, deadline: row.deadline, completed: row.completed, user: row.user };

                res(task);
            }
        });
    });
};

exports.getTasksByDeadline = (deadline, userId) => {
    return new Promise((res, rej) => {
        const sql = 'SELECT * FROM tasks WHERE DATE(deadline)=DATE(?) AND user=?';

        db.all(sql, [deadline, userId], (err, rows) => {
            if (err) {
                rej(err);
                return;
            }

            if (rows == undefined || rows.length == 0) {
                res({ error: 'Deadline you were looking for is not in the Database', tasks: [] });
            }

            const tasks = rows.map((t) => (
                { id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }
            ));

            res(tasks);
        });
    });
};

exports.getTasksByUserID = (userID) => {
    return new Promise((res, rej) => {
        const sql = 'SELECT * FROM tasks WHERE user=?';

        db.all(sql, [userID], (err, rows) => {
            if (err) {
                rej(err);
                return;
            }

            if (rows.length > 0) {
                const tasks = rows.map((t) => (
                    { id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }
                ));
                res(tasks);
            } else {
                if (rows == undefined || rows.length == 0) {
                    res({ error: 'Task not found', tasks: [] });
                    console.log('Task not found');
                } else {
                    const task = { id: rows.id, description: rows.description, important: rows.important, private: rows.private, deadline: rows.deadline, completed: rows.completed, user: rows.user };
                    res(task);
                }
            }
        });
    });
};

exports.getTasksByUserIDAndDateInterval = (userID, startDate, endDate) => {
    return new Promise((res, rej) => {
        const sql = 'SELECT * FROM tasks WHERE user=? AND DATE(deadline) >= DATE(?) AND DATE(deadline) <= DATE(?)';

        db.all(sql, [userID, startDate, endDate], (err, rows) => {
            if (err) {
                rej(err);
                return;
            }

            if (rows.length > 0) {
                const tasks = rows.map((t) => (
                    { id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }
                ));
                res(tasks);
            } else {
                if (rows == undefined || rows.length == 0) {
                    res({ error: 'No tasks matching your query were found', tasks: [] });
                    console.log('No tasks found');
                } else {
                    const task = { id: rows.id, description: rows.description, important: rows.important, private: rows.private, deadline: rows.deadline, completed: rows.completed, user: rows.user };
                    res(task);
                }
            }
        });
    });
};

exports.getImportantTasks = (userId) => {
    return new Promise((res, rej) => {
        const sql = 'SELECT * FROM tasks WHERE important=1 AND user=?';

        db.all(sql, [userId], (err, rows) => {
            if (err) {
                rej(err);
                return;
            }

            const tasks = rows.map((t) => (
                { id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }
            ));

            res(tasks);
        });
    });
};

exports.getPrivateTasks = (userId) => {
    return new Promise((res, rej) => {
        const sql = 'SELECT * FROM tasks WHERE private=1 AND user=?';

        db.all(sql, [userId], (err, rows) => {
            if (err) {
                rej(err);
                return;
            }

            const tasks = rows.map((t) => (
                { id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }
            ));

            res(tasks);
        });
    });
};

exports.createTask = (task, userId) => {
    return new Promise((res, rej) => {
        let lastID;
        const sqlID = 'SELECT COUNT(*) AS total FROM tasks';

        db.all(sqlID, [], (err, row) => {
            if (err) {
                rej(err);
                return;
            }

            lastID = row.total;
        });

        const sql = 'INSERT INTO tasks(id, description, important, private, deadline, completed, user) VALUES(?, ?, ?, ?, ?, ?, ?)';

        db.run(sql, [lastID + 1, task.description, task.important, task.private, task.deadline, task.completed, userId], function (err) {
            if (err) {
                rej(err);
                return;
            }

            res(this.lastID);
        });
    });
};

exports.updateTask = (task, id, userId) => {
    return new Promise((res, rej) => {
        const sql = 'UPDATE tasks SET description=?, important=?, private=?, deadline=?, completed=? WHERE id=? AND user=?';


        db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, id, userId], function (err) {
            if (err) {
                rej(err);
                return;
            }

            if (this.changes === 0) {
                res({ error: 'Task to be updated not found in the Database.' });
            }

            res(this.lastID);
        });
    });
};

exports.markTaskCompletion = (id, status, userId) => {
    return new Promise((res, rej) => {
        let r;

        const sql = 'UPDATE tasks SET completed=? WHERE id=? AND user=?;'

        db.run(sql, [status, id, userId],function (err) {
            if (err) {
                rej(err);
                return;
            }

            if (this.changes === 0) {
                res({ error: 'Task to mark not found in the Database' });
            }

            res(this.lastID);

        });
    });
}

exports.deleteTask = (id, userId) => {
    return new Promise((res, rej) => {
        const sql = 'DELETE FROM tasks WHERE id=? AND user=?';

        db.run(sql, [id, userId], function (err) {
            if (err) {
                rej(err);
                return;
            }

            if (this.changes === 0) {
                res({ error: 'Task to be deleted not found in the Database.' });
            } else {
                res(this.changes);
            }
        });
    });
};
