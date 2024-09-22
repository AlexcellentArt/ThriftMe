import React, { useState } from 'react';
function Dropdown({label, spanClassName='flex-v', children}) {
    const [expanded, setExpanded] = useState(false);
    return (<div className="dropdown flex-v">
        <button className='transparent' onClick={()=>{setExpanded(!expanded)}}>{label}</button>
        <span className={expanded ? spanClassName:`${spanClassName} unexpanded`}>{children}</span>
    </div>);
}
export default Dropdown;