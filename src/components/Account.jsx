import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext,useState } from "react";
import DisplayMany from "./DisplayMany";
import { useEffect } from "react";
import React from "react";

/**
 * I need to have multiple buttons that will lead to the:
 * Summary, 
 * Personal Info, 
 * Shop, 
 * History, 
 * Credit Cards,
 *  Addresses, 
 * Settings 
 * API calls should be user ID specific so only the client can see the actual information
 * So the API call should be for the database specific to them
 * 
 * Use effect can be used to pull for these.
 * If the user is able to see their account they would have been able to only their own information on the page 
 * 
 * 
 * I want to click a button and have the information for that page show up. 
 */


function Account() {

    useEffect(()=>{
        const 



    }


    return (<div>ACCOUNT</div>);
}

export default Account;