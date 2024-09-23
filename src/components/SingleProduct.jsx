import { AuthContext } from "./AuthContext";
import { useContext,useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import DisplayMany from "./DisplayMany";

function SingleProduct() {
   const {token,addToCart,toggleFavorite} = useContext(AuthContext);
   const {id} = useParams();

   const [product, setProduct] = useState(null);
   function createTag(obj) {
    console.log(obj)
    return (
      <div className="tag">
        <p>#{obj.text}</p>
      </div>
    );
  }
function createPhoto(obj) {
    console.log(obj)
    return (
      <div className="photo">
        <img className ="square photo fit-to-parent"src={obj.photo} alt={obj.photo} />
      </div>
    );
  }

   // in useEffect, make a fetch get call to items/:id
   useEffect(() => {
       async function getItem() {
           try {
               const response = await fetch(`http://localhost:3000/api/item/${id}`);
               //              is the fetch call path above correct?
               const result = await response.json();
               setProduct(result);
               console.log(result);
           } catch (error) {
               console.error(error)
           }
       }
       getItem();
   }, [id, token]);

   if (!product) {
    return <div>Product not found </div>;
}
   // Could probably get away with using a DisplayMany for the tags and another one for the additional photos
   // to see an example of how to use DisplayMany, look at SearchBar, where it is used to handle tags
   /// consult the Search Views / Products Page on our mockframe for how it should look
   // For reference on how the html should perhaps be structured, consider looking in f12 at an Etsy product page like this one: https://www.etsy.com/listing/1178358934/call-me-if-you-get-lost-vintage?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=Cute+Clothes&ref=sr_gallery-1-29&pro=1&pop=1&content_source=70e37ed25d53b15d87355691146c9ba55928239f%253A1178358934&search_preloaded_img=1&organic_search_click=1
   const photos = product.additional_photos.map((url)=>{return {"photo":url}})
   console.log(photos)
   return (
   <div className="flex-v">
    <div className="flex-h">
                {/* muliple photos are now displayed */}
      <DisplayMany data={photos} factory={createPhoto} additionalClasses={"flex-v flex-start fit-to-parent"}/>
      {product.default_photo && (
        <div>
          <img src={product.default_photo} alt={product.name} />
        </div>
      )}
      <div>
      <h1>{product.name}</h1>
    <p>{product.description}</p>
    <p>Price: ${product.price}</p>
    <button className="three-d-button" onClick={()=>{addToCart(product.id)}}>Add To Cart</button>
      {/* muliple tags are now displayed */}
      <DisplayMany data={product.tags.map((text)=>{return {"text":text}})} factory={createTag}additionalClasses={"flex-h"} />
      </div>
      </div>
      <div className="desc-box">{product.description}</div>
   </div>
);

}
export default SingleProduct;