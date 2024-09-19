import { AuthContext } from "./AuthContext";
import { useContext,useEffect,useState } from "react";
import { useParams } from "react-router-dom";
function SingleProduct() {
    const {token} = useContext(AuthContext);
    // in useEffect, make a fetch get call to items/:id
    useEffect(() => {
        
    }, []);
    // Could probably get away with using a DisplayMany for the tags and another one for the additional photos
    // to see an example of how to use DisplayMany, look at SearchBar, where it is used to handle tags
    /// consult the Search Views / Products Page on our mockframe for how it should look
    // For reference on how the html should perhaps be structured, consider looking in f12 at an Etsy product page like this one: https://www.etsy.com/listing/1178358934/call-me-if-you-get-lost-vintage?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=Cute+Clothes&ref=sr_gallery-1-29&pro=1&pop=1&content_source=70e37ed25d53b15d87355691146c9ba55928239f%253A1178358934&search_preloaded_img=1&organic_search_click=1
    return (<div>Single Product</div>);
}

export default SingleProduct;