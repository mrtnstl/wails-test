# api-tester-desktop-app

Testing Wails framework (Go + React).
The app is about REST endpoint testing, like Postman but much simpler

Here is a small read about the framework by Ibrahim Okić, that made me wanna look into it
https://dev.to/kaizerpwn/building-desktop-apps-with-wails-a-go-developers-perspective-526p

And the docs
https://wails.io/


## Use Cases

- as a user, i want to create 'projects', so my api tests are organized
- as a user, i want to create 'test cases', so my tests are easily repeatable
- as a user, i want to create 'test branches', so my tests chains can be controlled conditionally
- as a user, i want to to define the 'url', 'method', 'headers', 'query parameters' and 'body' of the test requests
- as a user, i want to run hte full test chain, so i can simulate complex request flows
- as a user, i want to run tests in a chain individually, so it is easier to debug if failing

## Screens

![Screens](https://github.com/mrtnstl/wails-test/blob/main/docs/screens.png "Screens")

## Architectural Considerations

will do something like this:

```
src/
├── backend/                # golang backend implementation
|   ├── app.go              # 
|   ├── storage/            #
│   |   └── sqlite.go       # sqlite database for project and settings persistence
|   └── apiTesting/         #
|       ├── runner.go       #
|       ├── projects.go     #
│       └── tests.go        #
├── build/                  # binaries
|   ├── darwin/             #
|   ├── windows/            #
├── docs/                   # documentations
├── frontend/               # View layer (React app)
│   ├── src/                # 
│   └── wailsjs             # 
├── .gitignore              # 
├── REAMDE.md               # project description
├── go.mod                  # application dependencies
├── go.sum                  # 
├── main.go                 # application entrypoint
└── wails.json              # wails framework config
```
