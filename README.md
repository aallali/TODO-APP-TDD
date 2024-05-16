# technical-test-c4

## Objective
Create a CRUD application for task management that includes user authentication and offers a visually
appealing user interface. Each task should have attributes like title, description, and status (e.g., pending,
completed).

## Tech Stack
- **Ui** : `React.Js`, `TypeScript`, `Tailwind`, `Zustand`
- **Server**: `Node.Js`, `TypeScript`, `Express.Js`, `Mongoose`
- **Db**: `MongoDb`
---
## UI
### Todo:
- [x] : setup skeleton
- [ ] : wait until server is done...
---
## Server
### Todo:
- [x] : setup skeleton
- [x] : setup jest for Unite test
- [x] : integrate mongoose
- [x] : setup DB drivers
- [x] : setup jwt auth system (user+pass, **`no email`**)
- [x] : setup auth middleware and test it
- [x] : create units tests for the auth flow
- follow TDD approach
- [x] service: **add task**
    `body: {title: string, description string, status: 'done'|'pending'}` + `userId from auth token`
    - [x] create unit test
    - [x] create the service

- [ ] - service: **update task** 
`body: {title: string, description string, status: 'done'|'pending', id: task._id}`
    - [ ] create unit test
    - [ ] create the service
- [ ] - service: **delete task**
    `param /{id}` + `user id from auth token to verify`
    - [ ] create unit test
    - [ ] create the service
- [ ] - service: **read tasks** 
    `get user id from token` + `fetch all tasks owned by this user id`
    - [ ] create unit test
    - [ ] create the service
