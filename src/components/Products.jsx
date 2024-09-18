import DisplayMany from "./DisplayMany";
import { useState,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
function Products() {
    // setState searchTags, should be an array of strings. Remember getting params from paths in the puppy bowl? That might be the best way to pass data from searchbar to products. Based on my testing on other sites, that seems to be how searches are done too. 
    // But for now, DO NOT concern yourself with this. Rather, focus on what happens when just the product page is navigated to.
    // in useEffect, make a fetch get call to items
    // make a useState to store the data got back
    // pass down the data to display
    // pass down function making product cards to display many
    /// consult the Search Views / Products Page on our mockframe for how it should look
    // to see an example of how to use DisplayMany, look at SearchBar, where it is used to handle tags
    return (<div>Products<DisplayMany/></div>);
}

export default Products;