package main

import (
	"embed"
	"fmt"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"

	"api-testing-platform/internals/storage"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	err := storage.InitDB()
	if err != nil {
		log.Fatalf("error initializing database: %v", err)
	}

	_, err = storage.DB.ExecQuery("INSERT INTO projects (name) VALUES ('my-frst-prjct');")
	if err != nil {
		log.Fatalf("error inserting into 'projects': %v", err)
	}
	res, err := storage.DB.ExecQuery("SELECT * FROM projects;")
	if err != nil {
		log.Fatalf("error selecting all from 'projects': %v", err)
	}
	fmt.Println("QUERY RESPONSE:", res)

	
	// Create an instance of the app structure
	app := NewApp()
	testCase := TestCase{}
	// Create application with options
	err = wails.Run(&options.App{
		Title:  "ApiTestingPlatform",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Frameless: true,
		CSSDragProperty: "widows",
        CSSDragValue:    "1",
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			&testCase,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}