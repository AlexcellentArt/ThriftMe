import { AuthContext } from "./AuthContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DisplayMany from "./DisplayMany";
// import Favorite from "./Favorite";
import { SearchContext } from "./SearchContext";
import { useNavigate, createSearchParams } from "react-router-dom";
function SingleProduct() {
  const nav = useNavigate();
  const { token, addToCart, addToBrowsingHistory } = useContext(AuthContext);
  const { setSearchParams } = useContext(SearchContext);
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [mainPhoto, setMainPhoto] = useState("");
  function navToProducts(tag) {
    setSearchParams({ tags: tag });
    nav({
      pathname: "/products/",
      search: createSearchParams({
        tags: [tag],
      }).toString(),
    });
  }
  function createTag(obj) {
    console.log(obj);
    return (
      <div className="tag">
        {/* Need to figure out how to update search bar tags too... maybe through SearchContext? */}
        <button
          onClick={() => {
            navToProducts(obj.text);
          }}
          className="transparent  big-text"
        >
          <p className="large-text merriweather-light">#{obj.text}</p>
        </button>
      </div>
    );
  }
  function createPhoto(obj) {
    console.log(obj);
    return (
      <button
        className="fit-to-parent"
        onClick={() => {
          setMainPhoto(obj.photo);
        }}
      >
        <img
          className="square fit-to-parent photo"
          src={obj.photo}
          alt={obj.photo}
        />
      </button>
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
        setMainPhoto(result.default_photo);
        console.log(result);
      } catch (error) {
        console.error(error);
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

  // sets up data for photo bar. Never changes so doesn't need to be a state
  const photos = [];
  product.additional_photos.forEach((url) => {
    console.log(url);
    if (url != "") {
      photos.push({ photo: url });
    }
  });
  if (photos.length > 0) {
    photos.unshift({ photo: product.default_photo });
  }
  console.log(photos);
  return (
    <div className="flex-v single-product">
      <div className="flex-h small-big-medium-width">
        {/* muliple photos are now displayed */}
        {photos.length && (
          <DisplayMany
            data={photos}
            factory={createPhoto}
            additionalClasses={"flex-v flex-start scroll-y"}
          />
        )}
        {product.default_photo && (
          <img
            className="rounded-corners square"
            src={mainPhoto}
            alt={product.name}
          />
        )}
        <div className="flex-v small-big-medium-height align-items-center">
          <div className="flex-h small-big-medium-width align-items-center">
            <h2 className="merriweather-black">${product.price}</h2>
            <span></span>
            {/* <Favorite/> */}
          </div>
          <div className="flex-v">
            <h1>{product.name}</h1>
            <button
              className="transparent dark-text"
              onClick={() => {
                nav("/shop/Seller", {
                  state: { id: product.seller_id },
                });
              }}
            >
              <p className="big-text merriweather-regular">Go To Seller Shop</p>
            </button>
          </div>
          <button
            className="three-d-button"
            onClick={() => {
              addToCart(product.id);
              addToBrowsingHistory(product.tags);
            }}
          >
            Add To Cart
          </button>
          {/* muliple tags are now displayed */}
          <DisplayMany
            data={product.tags.map((text) => {
              return { text: text };
            })}
            factory={createTag}
            additionalClasses={"flex-h stretch wrap"}
          />
        </div>
      </div>
      <div className="desc-box">
        <p className="merriweather-regular">{product.description}</p>
      </div>
    </div>
  );
}
export default SingleProduct;
