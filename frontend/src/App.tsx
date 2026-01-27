import { useState } from 'react';
import { AddTestCase, GetTestCases, ClearTestCases, ExecuteStoredTests, ExecuteTestsWithId } from "../wailsjs/go/main/App";
import type { main } from '../wailsjs/go/models';
import { Projects } from './components/Projects';
import { Settings } from './components/Settings';
import { TestBoard } from './components/TestBoard';
import { EditTestCase } from './components/EditTestCase';

type ViewState = "main" | "edit" | "settings";

function App() {
    const [viewState, setViewState] = useState<ViewState>("main");
    const [testCases, setTestCases] = useState<main.TestCase[]>([]);
    const [testData, setTestData] = useState<main.TestCase>({
        Headers: {},
        Body: {},
        QueryParams: {},
        APIResponse: {},
        Method: "",
        Url: "",
        Id: 0
    });
    const [testResultLog, setTestResultLog] = useState<{ts: Date, testId: number, result: string}[]>([]);
    const [resultText, setResultText] = useState("URL to test");

    function updateURLInput(e: any){
        setTestData({...testData, [e.target.name]: e.target.value});
    }

    async function handleSetTestCase(){
        try{
            const result = await AddTestCase(testData);
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
            APIResponse: {},
            Method: "",
            Url: "",
            Id: 0
        });
        setResultText("tests cleared");
    }
    
    async function handleRunTests(id: number){
        try{
            await ExecuteTestsWithId(id-1);
            await handleGetTestCases();
        } catch(err: any){
            setTestResultLog([{ts: new Date(), testId: -1, result: err.message}, ...testResultLog]);
            console.log("HIBA!", err);
        }
    }

    async function handleExecuteStoredTests(){
        await ExecuteStoredTests();
        await handleGetTestCases();
    }
    function ViewStateMachine(currentState: ViewState, nextState: ViewState){
        const stateChangeMap = {
            "main": ["edit", "settings"],
            "edit": ["main"],
            "settings": ["main"]
        }
        if(!stateChangeMap[currentState].includes(nextState)){
            console.log("illegal state change!!!");
            return;
        }
        setViewState(nextState);
    }

    function handleViewChange(nextState: ViewState){
        ViewStateMachine(viewState, nextState);
    }
    switch(viewState){
        case "main":
            return (
                <>
                    <div style={{widows: "1"}} className="app__header">header</div>
                    <div className="App">
                        <Projects handleViewChange={handleViewChange} />
                        <TestBoard handleViewChange={handleViewChange}/>
                    </div>
                </>
            )
        case "edit":
            return (
                <>
                    <div style={{widows: "1"}} className="app__header">header</div>
                    <div className="App">
                        <EditTestCase handleViewChange={handleViewChange}/>
                        <TestBoard handleViewChange={handleViewChange}/>
                    </div>
                </>
            )
        case "settings":
            return (
                <>
                    <div style={{widows: "1"}} className="app__header">header</div>
                    <div className="App">
                        <Settings handleViewChange={handleViewChange}/>
                        <TestBoard handleViewChange={handleViewChange}/>
                    </div>
                </>
            )
        default:
            return (
                <>
                    <div style={{widows: "1"}} className="app__header">header</div>
                    <div className="App">
                        <Projects handleViewChange={handleViewChange}/>
                        <TestBoard handleViewChange={handleViewChange}/>
                    </div>
                </>
            )
    }   
}

export default App;


/* 
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
                    <div id="" className="">
                        <h2 className="sectionTitle">test settings</h2>
                        <div id="">{resultText}</div>
                        <input id="name" className="" value={testData.Url} onChange={updateURLInput} autoComplete="off" name="Url" type="text"/>
                        <input id="url" className="" value={testData.Method} onChange={updateURLInput} autoComplete="off" name="Method" type="text"/>
                        <button className="" onClick={handleSetTestCase}>set url</button>
                    </div>
                    <div id="testCasesView">
                    {testCases.length > 0 ? (
                        testCases.map( testCase => (
                        <span className={"testCasesViewItem "} key={testCase.Id}>
                            {testCase.Id}: {testCase.Url}<br/>{testCase.Method}<br/>{ Object.keys(testCase.APIResponse).length > 0 && "request finished" || "no result"}
                            <button data-case-id={testCase.Id} onClick={()=>handleRunTests(testCase.Id)}>exec</button>
                        </span>
                        ))
                    ) : (
                        <p>No test cases yet</p>
                    )}
                    </div>
                    <div id="testControls">
                        <button className="btn" onClick={handleExecuteStoredTests}>run all</button>
                        <button className="btn" onClick={handleClearTestCases}>clear all</button>
                    </div>
                </div>
                <div id="testResultWrapper" className="sectionBase">
                    <h2 className="sectionTitle">test result</h2>
                    <div id="testResult">
                        {testCases.length > 0 ? (
                            testCases.map( testCase => (
                                Object.keys(testCase.APIResponse).length > 0 &&
                            <p className={""} key={testCase.Id}>
                                {testCase.Id}: {testCase.Method}: {JSON.stringify(testCase.APIResponse, null, 2)}
                            </p>
                            ))
                        ) : (
                            <p>No test result</p>
                        )}
                    </div>
                </div>
            </div>
        </div>*/