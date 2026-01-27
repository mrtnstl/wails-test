type ViewState = "main" | "edit" | "settings";

export const EditTestCase = (children: {handleViewChange: (nextState: ViewState)=>void}) => {
  const {handleViewChange} = children;
  return (
    <div id="edittestcase__wrapper" className="component">
      <h1>EditTestCase</h1>
      <button onClick={()=>handleViewChange("main")}>back</button>
      <p>edit request</p>
    </div>
  )
}
