type ViewState = "main" | "edit" | "settings";

export const Settings = (children: {handleViewChange: (nextState: ViewState)=>void}) => {
  const {handleViewChange} = children;
  return (
    <div id="settings__wrapper" className="component">
      <div>
        <h1>Settings</h1>
        <button onClick={()=>handleViewChange("main")}>back</button>
      </div>
      <p>some settings</p>
      <div>
        <button>save</button>
        <button>reset</button>
      </div>
    </div>
  )
}
