package utils

import (
	"encoding/json"
	"fmt"
)

func encodeCaseSettings(){
	fmt.Println("decoding case settings")

	testData := &TestData{ Name: "teszt", Id: 1}
	testJson, err := json.Marshal(testData)
	if err != nil {
		fmt.Println("error encoding JSON:", err)
		return
	}

	fmt.Println("result JSON:", testJson)
}

func encodeCaseResult(){
	fmt.Println("decoding case result")
}

type TestData struct {
	Name string 	`json:"name"`
	Id 		int 	`json:"id"`
}