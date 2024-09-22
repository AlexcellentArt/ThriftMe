import React, { useState } from 'react';
function Dropdown({label, children}) {
    const [expanded, setExpanded] = useState(false);
    return (<span className="dropdown flex-v">
        <button className='transparent' onClick={()=>{setExpanded(!expanded)}}>{label}</button>
        {expanded && <div>{children}</div>}
    </span>);
}
export default Dropdown;
// TEMPLATE: <Dropdown label="DropDownName">InsertContentHere</Dropdown>
// EXAMPLE: <Dropdown label="Example"><p>Blah</p><p>Blah</p></Dropdown>