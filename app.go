package main

import (
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

var testCasesSlice = make([]TestCase, 0)
var lastTestCaseIndex = 0

type TestCase struct {
	Id int
	Method string
	Url string
}

func (a *App) AddTestCase(data TestCase) TestCase {
	lastTestCaseIndex = lastTestCaseIndex + 1
	data.Id = lastTestCaseIndex

	testCasesSlice = append(testCasesSlice, data)

	fmt.Println(testCasesSlice)
	return data
}

func (a *App) GetTestCases() []TestCase {
	return testCasesSlice
}

func (a *App) ClearTestCases() {
	testCasesSlice = make([]TestCase, 0)
	lastTestCaseIndex = 0
}