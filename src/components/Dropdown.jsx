import React, { useState } from 'react';
function Dropdown({label, startExpanded=false,labelClasses,children}) {
    const [expanded, setExpanded] = useState(startExpanded);
    return (<span className="dropdown flex-v">
        <button className={`transparent ${labelClasses}`} onClick={()=>{setExpanded(!expanded)}}>{label}</button>
        {expanded && <span>{children}</span>}
    </span>);
}
export default Dropdown;
// TEMPLATE: <Dropdown label="DropDownName">InsertContentHere</Dropdown>
// EXAMPLE: <Dropdown label="Example"><p>Blah</p><p>Blah</p></Dropdown>