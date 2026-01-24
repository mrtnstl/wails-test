import { useState } from 'react';
import './App.css';
import { AddTestCase, GetTestCases, ClearTestCases, MakeRequest } from "../wailsjs/go/main/App";
import type { main } from '../wailsjs/go/models';

function App() {
    const [testCases, setTestCases] = useState<main.TestCase[]>([]);
    const [testData, setTestData] = useState<main.TestCase>({
        Headers: {},
        Body: {},
        QueryParams: {},
        APIResponse: null,
        Method: "",
        Url: "",
        Id: 0
    });
    const [testResultLog, setTestResultLog] = useState<{ts: Date, result: string}[]>([]);
    const [resultText, setResultText] = useState("URL to test");

    function updateURLInput(e: any){
        setTestData({...testData, [e.target.name]: e.target.value});
    }

    async function handleSetTestCase(){
        try{
            const result = await AddTestCase(testData);
            console.log(testData)
            setResultText(`${result.Url}\t${result.Method}`);
            await handleGetTestCases();
        } catch(err){
            setResultText(`ERROR!`);
        }
    }

    async function handleGetTestCases(){
        try{
            const result = await GetTestCases();
            setTestCases(result);
        } catch(err){
            console.log(err)
        }
    }

    async function handleClearTestCases(){
        await ClearTestCases();
        await handleGetTestCases();
        setTestResultLog([]);
        setTestData({
            Headers: {},
            Body: {},
            QueryParams: {},
            APIResponse: null,
            Method: "",
            Url: "",
            Id: 0
        });
        setResultText("tests cleared");
    }
    
    async function handleRunTests(){
        try{
            const result = await MakeRequest(
                testData.Url,
                testData.Method,
                {"Content-Type": "application/json"},
                {"username": "JohnDoe"},
                {"sort": "desc"}
            );
            setTestResultLog([{ts: new Date(), result: result}, ...testResultLog]);
            console.log(result)
        } catch(err){
            setTestResultLog([{ts: new Date(), result: err.toString()}, ...testResultLog]);
            console.log(err)
        }
    }

    return (
        <div id="App">
            <div id="projectsWrapper" className="sectionBase">
                <h2 className="sectionTitle">Projects</h2>
                <ul id="projectsList" className="listBase">
                    <li className="projectsListItem"></li>
                    <li className="projectsListItem"></li>
                    <li className="projectsListItem"></li>
                    <li className="projectsListItem"></li>
                </ul>
            </div>
            <div id="testWrapper">
                <div id="testSettingsWrapper" className="sectionBase">
                    <h2 className="sectionTitle">test settings</h2>
                    <div id="result">{resultText}</div>
                    <div id="input" className="input-box">
                        <input id="name" className="input" value={testData.Url} onChange={updateURLInput} autoComplete="off" name="Url" type="text"/>
                        <input id="url" className="input" value={testData.Method} onChange={updateURLInput} autoComplete="off" name="Method" type="text"/>
                        <button className="btn" onClick={handleSetTestCase}>set url</button>
                        <button className="btn" onClick={handleRunTests}>quick run</button>
                        <button className="btn" onClick={handleClearTestCases}>clear all</button>
                    </div>
                    <div id="testCasesView">
                    {testCases.length > 0 ? (
                        testCases.map( testCase => (
                        <span className="testCasesViewItem" key={testCase.Id}>
                            {testCase.Id}: {testCase.Url}<br/>{testCase.Method}
                            <button onClick={console.log}>exec</button>
                        </span>
                        ))
                    ) : (
                        <p>No test cases yet</p>
                    )}
                    </div>
                </div>
                <div id="testResultWrapper" className="sectionBase">
                    <h2 className="sectionTitle">test result</h2>
                    <div id="testResult">
                        {testResultLog.length > 0 ? 
                        (testResultLog.map((row, index) =>(
                            <p key={index} className="testResP">{row.ts.toLocaleTimeString()}: {row.result}</p>
                        )))
                            : <p>No results found</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
