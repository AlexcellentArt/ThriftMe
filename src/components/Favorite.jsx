import React, { useState,useContext } from 'react';

import { AuthContext } from "./AuthContext";
function Favorite(id) {
    const {NotLoggedIn,AutoHeader} = useContext(AuthContext)
    async function toggleFavorite(id) {
        if (NotLoggedIn()) {
          return;
        }
        else {
          const res = await fetch(`http://localhost:3000/api/user/favorite`,{headers:AutoHeader(),body:{}});
        }
      }
    return (<button onClick={()=>{toggleFavorite(id)}}></button>);
}

export default Favorite;