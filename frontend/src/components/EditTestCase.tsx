type ViewState = "main" | "edit" | "settings";

export const EditTestCase = (children: {handleViewChange: (nextState: ViewState)=>void}) => {
  const {handleViewChange} = children;
  function handleSubmit(){
    console.log("test case edit saved")
  }
  return (
    <div id="edittestcase__wrapper" className="component">
      <div id="edittestcase__header">
        <h1>EditTestCase</h1>
        <button onClick={()=>handleViewChange("main")}>back</button>
      </div>
      <form onSubmit={handleSubmit} id="edit__form">
        <div className="form__section" id="edit__form__method__url">
          <select name="reqMethod" id="select__method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
            <option value="HEAD">HEAD</option>
          </select>
          <input id="input__url" type="text" value={"url"} />
        </div>
        <div className="form__section" id="edit__form__attributes">
          <span id="button__group__fieldtype">
            <button>headers</button>
            <button>query</button>
            <button>body</button>
          </span>
          <div id="inputs__fieldtype">
            <span className="input__keyvalue">
              <input type="text" /><input type="text" />
            </span>
            <span className="input__keyvalue">
              <input type="text" /><input type="text" />
            </span>
            <span className="input__keyvalue">
              <input type="text" /><input type="text" />
            </span>
            <span className="input__keyvalue">
              <input type="text" /><input type="text" />
            </span>
            <span className="input__keyvalue">
              <input type="text" /><input type="text" />
            </span>
          </div>
        </div>
        <div className="form__section">
          <button>save</button>
          <button>delete</button>
        </div>
      </form>
    </div>
  )
}
