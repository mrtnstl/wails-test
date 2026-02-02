type ViewState = "main" | "edit" | "settings";

export const TestBoard = (children: {handleViewChange: (nextState: ViewState)=>void}) => {
    const {handleViewChange} = children;
  return (
    <div id="testboard__wrapper" className="component">
        <h2>my first project</h2>
        <ul id="testboard__board">
            <li className="test__item test_item--add" onClick={()=>handleViewChange("edit")}>+</li>
        </ul>
        <div>
            <button>run</button>
            <button>delete</button>
        </div>
    </div>
  )
}
