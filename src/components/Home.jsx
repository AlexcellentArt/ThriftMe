import DisplayMany from "./DisplayMany";
import { useState, useEffect,useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useParams, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const {getUser} = useContext(AuthContext)
  const [data, setData] = useState([{}]);
  const [normal, updated_normal_page] = useState();
  const user_id = 2;
  useEffect(() => {
    async function getTrendyProducts() {
      try {
        const user = await getUser()
        console.log(user)
        const browsing_history = user.browsing_history
        // await fetch(
        //   `http://localhost:3000/api/browsing_history/${user_id}`
        // );
        // console.log(browsing_history);
        // if (browsing_history === undefined) {
        //   throw "No Browsing History Found"
        // }
        for (let index = 0; index < browsing_history.looked_at_tags.length; index++) {
          try {
            const tag = browsing_history.looked_at_tags
            console.log(tag)
            const response = await fetch(
              "http://localhost:3000/api/item/search",
              { method: "POST", body: { tags: [tag] } }
            );
            // `http://localhost:3000/api/item/search`,
            //   {
            //     header: head,
            //     method: "POST",
            //     body: { search_text: "", tags: [tag] },
            //   };
            console.log("responedse");
            const data = await response.json();
            console.log(data);
            setData(data);
          } catch (error) {
            console.log("Looks Like your home page is not displaying");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    getTrendyProducts();
  }, []);
  function generateCard(obj) {
    return (
      <div className="item-card">
        <div>
          <button
            className="three-d-button"
            onClick={() => {
              toggleFavorite(obj.id);
            }}
          >
            Add To Favorites
          </button>
          <img
            src={obj.default_photo}
            alt="Default Item Card Photo"
            className="square"
          />
          <p>${obj.price}</p>
        </div>

        <div>
          <a href={`http://localhost:5173/products/${obj.id}`}>{obj.name}</a>
          {/* <p>{obj.name}</p> */}
          <button
            className="adding-button"
            onClick={() => {
              addToCart(obj.id);
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      Products
      <DisplayMany data={data} factory={generateCard} />
    </div>
  );
}

export default Home;
