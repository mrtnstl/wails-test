package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
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

//-----------------------

// slice to store the user defined api test cases
var testCasesSlice = make([]TestCase, 0)
var lastTestCaseIndex = 0

type Headers map[string]string
type Body map[string]any
type QueryParams map[string]any

type APIResponse any

type TestCase struct {
	Headers Headers
	Body Body
	QueryParams QueryParams
	APIResponse APIResponse
	Method string
	Url string
	Id int
}

// exported method for adding new test case
func (a *App) AddTestCase(data TestCase) TestCase {
	lastTestCaseIndex = lastTestCaseIndex + 1
	data.Id = lastTestCaseIndex
	
	testCasesSlice = append(testCasesSlice, data)
	
	fmt.Println(testCasesSlice)
	return data
}
// exported method for geting the whole test cases slice
func (a *App) GetTestCases() []TestCase {
	return testCasesSlice
}

// exported method for clearing all defined test cases
func (a *App) ClearTestCases() {
	testCasesSlice = make([]TestCase, 0)
	lastTestCaseIndex = 0
}


// global http client
var client = &http.Client{
	Timeout: 10 * time.Second,
}

// abstracted handler | TODO: refactor
func DoRequest(ctx context.Context, method, urlStr string, headers, queryParams map[string]string, payload any, response any) error {
	var body io.Reader
	if payload != nil {
		jsonData, err := json.Marshal(payload)
		if err != nil {
			return fmt.Errorf("json marshal error: %w", err)
		}
		body = bytes.NewReader(jsonData)
	}

	u, err := url.Parse(urlStr)
	if err != nil {
		return fmt.Errorf("url parse error: %w", err)
	}
	q := u.Query()
	for k, v := range queryParams {
		q.Set(k, v)
	}
	u.RawQuery = q.Encode()

	req, err := http.NewRequestWithContext(ctx, method, u.String(), body)
	if err != nil {
		return fmt.Errorf("request creation error: %w", err)
	}

	for k, v := range headers {
		req.Header.Set(k, v)
	}

	if payload != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("http request error: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		bodyBytes, _ := io.ReadAll(resp.Body) // this get error code
		return fmt.Errorf("http error: %d - %s - Body: %s", resp.StatusCode, resp.Status, string(bodyBytes))
	}

	if response != nil {
		if err := json.NewDecoder(resp.Body).Decode(response); err != nil {
			return fmt.Errorf("json decode error: %w", err)
		}
	}

	return nil
}

// exported method for calling adhoc http requests
func (a *App) MakeRequest(url string, method string, headers map[string]string, body map[string]any, queryParams map[string]any) (string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	switch method {
	case "GET":
		var getResult map[string]any
		err := DoRequest(ctx, http.MethodGet, url, 
			map[string]string{"Authorization": "Bearer token"}, 
			map[string]string{"id": "123", "sort": "desc"}, 
			nil, &getResult)
		if err != nil {
			fmt.Println("error:", err)
			return fmt.Sprint("error during" + method + "request")
		}
		fmt.Printf("GET response: %+v\n", getResult)
		return fmt.Sprint("GET response: %+v\n", getResult)

	case "POST", "PUT":
		type User struct {
			Name  string `json:"name"`
			Email string `json:"email"`
		}
		payload := User{Name: "Kiss Márton", Email: "marton@example.com"}
		var postResult map[string]any
		err := DoRequest(ctx, http.MethodPost, url, 
			map[string]string{"Content-Type": "application/json"}, 
			nil, payload, &postResult)
		if err != nil {
			fmt.Println("error:", err)
			return fmt.Sprint("error during" + method + "request")
		}
		fmt.Printf("POST response: %+v\n", postResult)
		return fmt.Sprint("POST response: %+v\n", postResult)

	case "DELETE":
		err := DoRequest(ctx, http.MethodDelete, url, 
			map[string]string{"Authorization": "Bearer token"}, 
			nil, nil, nil)
		if err != nil {
			fmt.Println("error:", err)
			return fmt.Sprint("error during" + method + "request")
		}
		fmt.Printf("DELETE success\n")
		return fmt.Sprint("DELETE success\n")
	default:
		fmt.Println("error, method mismatch")
		return fmt.Sprint("error, method mismatch")
	}

}

// TODO: implement automatic test function, that is iterating through testCasesSlice
