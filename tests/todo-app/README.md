# Todo App

A simple REST API for managing todos. Built with Express.js.

## Endpoints

- `GET /todos` — list all todos
- `POST /todos` — create a todo `{ "title": "string" }`
- `PATCH /todos/:id` — update done status `{ "done": true }`
- `DELETE /todos/:id` — remove a todo
