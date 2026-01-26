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
var testCaseResults = make([]any, 0)
var lastTestCaseIndex = 0

type Headers map[string]string
type Body map[string]any
type QueryParams map[string]any

type APIResponse map[string]any

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
	
	fmt.Println("CURRENT test cases", testCasesSlice)
	return data
}
// exported method for geting the whole test cases slice
func (a *App) GetTestCases() *[]TestCase {
	fmt.Println("ALL test cases", &testCaseResults)
	return &testCasesSlice
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
func DoRequest(ctx context.Context, method, urlStr string, headers Headers, queryParams QueryParams, payload any, response any) error {
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
		q.Set(k, v.(string))
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
	req.Header.Set("X-Request-ID", "mock_reqest_id_12345")

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

func (a *App) ExecuteStoredTests() error {
	cases := a.GetTestCases()

	for i, c := range *cases {
		fmt.Println("Case index:", i, "Case:", c.Id, " ", c.Method, " ", c.Url)
		RunATest(&testCasesSlice[i])
	}

	return nil
}

func (a *App) ExecuteTestsWithId(id int) {
	cases := a.GetTestCases()
	
	var selectedCase *TestCase

	for index, _ := range *cases {
		if index == id {
			selectedCase = &testCasesSlice[index]
		}
	}
	if selectedCase == nil {
		fmt.Println("selectedCase is nil!")
		return
	}
	RunATest(selectedCase);
	fmt.Println("SELECTED case", selectedCase)
	return
}

func RunATest(t *TestCase) {
	// DoRequest(ctx context.Context, method, urlStr string, headers, queryParams map[string]string, payload any, response any) error

	url := t.Url
	method := t.Method
	headers := t.Headers
	//body := t.Body
	queryParams := t.QueryParams

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	switch method {
	case "GET":
		var getResult APIResponse
		err := DoRequest(ctx, http.MethodGet, url, 
			headers, //map[string]string{"Authorization": "Bearer token"}, 
			queryParams, //map[string]string{"id": "123", "sort": "desc"}, 
			nil, &getResult)
		if err != nil {
			fmt.Println("error:", err)
			t.APIResponse = map[string]any{ "error": fmt.Errorf("error during" + method + "request")}
		}
		fmt.Printf("GET response: %+v\n", getResult)
		t.APIResponse = getResult

	case "POST", "PUT":
		type User struct {
			Name  string `json:"name"`
			Email string `json:"email"`
		}
		payload := User{Name: "Kiss Márton", Email: "marton@example.com"}
		var postResult APIResponse
		err := DoRequest(ctx, http.MethodPost, url,
			headers,
			nil,
			payload, &postResult)
		if err != nil {
			fmt.Println("error:", err)
			t.APIResponse = map[string]any{ "error": fmt.Errorf("error during" + method + "request")}
		}
		fmt.Printf("POST response: %+v\n", postResult)
		t.APIResponse = postResult

	case "DELETE":
		err := DoRequest(ctx, http.MethodDelete, url, 
			headers, //map[string]string{"Authorization": "Bearer token"}, 
			nil, nil, nil)
		if err != nil {
			fmt.Println("error:", err)
			t.APIResponse = map[string]any{ "error": fmt.Errorf("error during" + method + "request")}
		}
		fmt.Printf("DELETE success\n")
		t.APIResponse = map[string]any{"success": "DELETE success"}
	default:
		fmt.Println("error, method mismatch")
		t.APIResponse = map[string]any{ "error": "error, method mismatch"}
	}
}