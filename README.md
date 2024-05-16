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
- [x] : wait until server is done...
- [ ] : create login
- [ ] : test login component
- [ ] : create new task input component
- [ ] : update task [title, description, status] functionlity
- [ ] : delete task 
- [ ] : fetch all tasks
- [ ] : tasks filter on browser
- [ ] : write tests
- [ ] : add some screenshots to readme
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
    - [x] create unit test
    - [x] create the service
- [x] - service: **update task** 
    - [x] create unit test
    - [x] create the service
- [x] - service: **delete task**
    - [x] create unit test
    - [x] create the service
- [x] - service: **read tasks** 
    - [x] create unit test
    - [x] create the service
- [ ] - document the roadmap
