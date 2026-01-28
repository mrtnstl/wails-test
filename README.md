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

currently:

```
src/
├── build/                 # binaries
|   ├── darwin/            #
|   ├── windows/           #
├── docs/                  # documentations
├── frontend/              # View layer (React app)
│   ├── cascade.rs         # 
│   ├── properties.rs      # 
│   └── values.rs          # 
├── .gitignore             # 
├── REAMDE.md              # project description
├── app.go                 # currently all logic resides here (REFACTOR)
├── go.mod                 # application dependencies
├── go.sum                 # 
├── main.go                # application entrypoint
└── wails.json             # wails framework config
```

will do something like this:

```
src/
├── backend/               # golang backend implementation
|   ├── app.go             # 
|   ├── controller/        #
|   ├── service/           #
|   ├── util/              #
├── build/                 # binaries
|   ├── darwin/            #
|   ├── windows/           #
├── docs/                  # documentations
├── frontend/              # View layer (React app)
│   ├── src/               # 
│   └── wailsjs            # 
├── .gitignore             # 
├── REAMDE.md              # project description
├── go.mod                 # application dependencies
├── go.sum                 # 
├── main.go                # application entrypoint
└── wails.json             # wails framework config
```
