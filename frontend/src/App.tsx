import { useState } from 'react';
import './App.css';
import { AddTestCase, GetTestCases, ClearTestCases } from "../wailsjs/go/main/App";
import type { main } from '../wailsjs/go/models';

function App() {
    const [testCases, setTestCases] = useState<main.TestCase[]>([]);
    const [testData, setTestData] = useState<main.TestCase>({
        Id: 0,
        Method: "",
        Url: ""
    });
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
    }
    async function handleRunTests(){

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
                        <input id="name" className="input" onChange={updateURLInput} autoComplete="off" name="url" type="text"/>
                        <input id="url" className="input" onChange={updateURLInput} autoComplete="off" name="method" type="text"/>
                        <button className="btn" onClick={handleSetTestCase}>set url</button>
                        <button className="btn" onClick={handleRunTests}>run</button>
                        <button className="btn" onClick={handleClearTestCases}>clear</button>
                    </div>
                    <div id="testCasesView">
                    {testCases.length > 0 ? (
                        testCases.map((testCase, index) => (
                        <p className="testCasesViewItem" key={index}>{testCase.Id}: {testCase.Url}<br/>{testCase.Method}</p>
                        ))
                    ) : (
                        <p>No test cases yet</p>
                    )}
                    </div>
                </div>
                <div id="testResultWrapper" className="sectionBase">
                    <h2 className="sectionTitle">test result</h2>
                    <div id="testResult">
                        <p className="testResP">- GET  /</p>
                        <p className="testResP">&nbsp;&nbsp;&nbsp;&nbsp;OK</p>
                        <p className="testResP">- POST  /auth/register</p>
                        <p className="testResP">&nbsp;&nbsp;&nbsp;&nbsp;OK</p>
                        <p className="testResP">- POST  /auth/login</p>
                        <p className="testResP">&nbsp;&nbsp;&nbsp;&nbsp;OK</p>
                        <p className="testResP">- POST  /posts</p>
                        <p className="testResP">&nbsp;&nbsp;&nbsp;&nbsp;OK</p>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
