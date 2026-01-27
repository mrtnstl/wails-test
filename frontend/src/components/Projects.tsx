type ViewState = "main" | "edit" | "settings";

export const Projects = (children: {handleViewChange: (nextState: ViewState)=>void}) => {
  const {handleViewChange} = children;
  return (
    <div id="projects__wrapper" className="component">
      <h1>Projects</h1>
      <ul id="projects__list">
        <li>project_01</li>
        <li>project_02</li>
        <li>project_03</li>
      </ul>
      <button onClick={()=>handleViewChange("settings")}>settings</button>
    </div>
  )
}
