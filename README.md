# api-tester-desktop-app

Testing Wails framework (Go + React).
The app is about REST endpoint testing, like Postman but much simpler

Here is a small read about the framework by Ibrahim Okić, that made me wanna look into it
https://dev.to/kaizerpwn/building-desktop-apps-with-wails-a-go-developers-perspective-526p

And the docs
https://wails.io/

## Screens

![Screens](https://github.com/mrtnstl/wails-test/blob/main/docs/screens.png "Screens")

## Architectural Considerations

will look like something like this:

```
src/
├── cmd/                    # 
|   └── app.go              #
├── internals/              # backend/logic (golang)
|   ├── types/              # (???)
|   ├── storage/            #
│   |   ├── sqlite.go       # sqlite database for projects, tests and settings persistence
|   |   └── fileWriter.go   # file writer for projects, tests and settings persistence
|   └── suite/              #
|       ├── runner.go       # test runner
|       ├── project.go     # user projects
│       └── testCase.go        # user tests
├── build/                  # 
|   ├── darwin/             # mac binaries
|   └── windows/            # windows binaries
├── docs/                   # documentation
├── frontend/               # view layer (React app)
│   ├── src/                # 
│   └── wailsjs             # 
├── .gitignore              # 
├── REAMDE.md               # application description
├── go.mod                  # application dependencies
├── go.sum                  # 
├── main.go                 # application entrypoint
└── wails.json              # wails framework config
```


## 

on linux if 'wails doctor: libwebkit not found', install libwebkit2gtk-4.1-dev
during dev and build, use flag '-tags webkit2_41'
