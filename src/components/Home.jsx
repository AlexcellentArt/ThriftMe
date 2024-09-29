import DisplayMany from "./DisplayMany";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import Products from "./Products";
import { HeaderContext } from "./HeaderContext";
import { ShopNow } from "./ShopNow";
function Home() {
  const navigate = useNavigate();
  const { setAdditonalContent } = useContext(HeaderContext);
  const { token, getUser } = useContext(AuthContext);
  const [productData, setProductData] = useState([{}]);
  const [normal, updated_normal_page] = useState();
  const [trendingShop, setTrendingShop] = useState(undefined);
  const [shopMeData, setShopMeData] = useState([{ tag: "", img: "" }]);
  const [trendData, setTrendData] = useState([{}]);
  

  // effect to get products
  useEffect(() => {
    async function getTrendyProducts() {
      try {
        const user = await getUser();
        console.log(user);
        if (!user) {
          console.error("Not Logged In");
          throw new Error("Not Logged In. Showing Generic Instead.");
        }
        const browsing_history = user.browsing_history;
        // make call to get all data that has one of the tags for the all view
        const response = await fetch("http://localhost:3000/api/item/search", {
          method: "POST",
          body: { tags: browsing_history.looked_at_tags },
        });
        const data = await response.json();
        console.log(data);
        // view will be all at first
        setProductData(data);

        // get data for trending views, max 5
        const tagData = await makeTagData(data.slice(5).map((obj)=>{return obj.tags[0]}))
        //... and add at the start all
        tagData.unshift({ tag: "All", data: data });
        // set trending data
        await setTrendData(tagData);
        // create shop me data
        await makeShopMeData(tagData)
      } catch (error) {
        console.error(error);
        const genData = await getGenericProducts();
        return genData;
      }
    }
    async function getGenericProducts() {
      try {
        const response = await fetch("http://localhost:3000/api/item");
        const genericData = await response.json();
        // create trend data, getting at max 5 tags and data from 5 items
        const tagData = await makeTagData(genericData.slice(5).map((obj)=>{return obj.tags[0]}))
        //... and add at the start all
        tagData.unshift({ tag: "All", data: genericData });
        setTrendData(tagData);
        await setProductData(genericData);
        await makeShopMeData(tagData)
        return genericData;
      } catch (error) {
        console.error("Error fetching generic products", error);
      }
    }
    async function makeTagData(input_data) {
      const tagData = []
      const loopLength = input_data.length < 5 ? input_data.length:5
      for (
        let index = 0;
        index < loopLength;
        index++
      ) {
        try {
          const tag = input_data[index];
          console.log(tag);
          const response = await fetch(
            "http://localhost:3000/api/item/search",
            { method: "POST", body: { tags: [tag] } }
          );
          const data = await response.json();
          console.log(data);
          tagData.push({ name: tag, data: data });
        } catch (error) {
          console.error(error);
        }
      }
      return tagData
    }
    async function makeShopMeData(tag_data) {
      console.log("MAKING SHOP")
      console.log(tag_data[0].data[0].seller_id )
      const seller_id = tag_data.shift().data[0].seller_id 
      console.log("SELLER_ID "+seller_id)
      // if (!tag_data[0].data[0].seller_id){return}
      // first seller in data for first in trendData is made a trending shop and popped off...
      const response_shop = await fetch(`http://localhost:3000/api/user/shop/${seller_id}`, {
        method: "POST",
        body: { id: seller_id},
      });
      const shop = await response_shop.json();
      // console.log(shop)
      shop["default_photo"] = shop.items[0].default_photo
      console.log(shop)
      setTrendingShop(shop);
      console.log("MAKING TAGS")
      console.log(tag_data)
      // next 4 are made into the smaller shop me
      const shopMeTags = tag_data.map((trend)=>{return {tag:trend.name,img:trend.data[(Math.floor(Math.random() * trend.data.length))].default_photo}})
      // console.log(shopMeData)
      setShopMeData(shopMeTags)
      console.log("SHOP ME DATA MADE")
      console.log(shopMeTags)
    }
    setAdditonalContent(<div>Home</div>);
    // if the user is logged in or not can be determined by if the token is null or not
    // fetch generic products when not logged in
    token ? getTrendyProducts() : getGenericProducts();
  }, []);


  const makeButtons = () => {
    const buttons = [];
    console.log("TRRR");
    console.log(trendData.length);
    console.log(trendData);
    // will set the data being shown in display many accordingly when pressed on
    trendData.forEach((obj) => {
      buttons.push(
        <button
          className="transparent dark-text large-text"
          onClick={() => {
            setData(obj.data);
          }}
        >
          {obj.tag}
        </button>
      );
    });
    return <div className="button-box ">{...buttons}</div>;
  };
  function makeShopMe(){
    return(
        <div className="flex-h stretch force-fill-width">
        <ShopNow
          headerMsg={shopMeData[0].tag}
          headerSize={2}
          bgClasses="desc-box"
          img={shopMeData[0].img}
          alt={"alt text here"}
          path="products"
          params={{tags:[shopMeData[0].tag]}}
        />
        <div className="flex-v">
          <ShopNow
              headerMsg={shopMeData[1].tag}
              headerSize={3}
            bgClasses="desc-box"
            img={shopMeData[1].img}
            alt={"alt text here"}
            path="products"
            params={{tags:[shopMeData[1].tag]}}
          />
          <div className="flex-h">
          <ShopNow
              headerMsg={shopMeData[2].tag}
              headerSize={3}
            bgClasses="desc-box"
            img={shopMeData[2].img}
            alt={"alt text here"}
            path="products"
            params={{tags:[shopMeData[2].tag]}}
          />
            <ShopNow
              headerMsg={shopMeData[3].tag}
              headerSize={4}
              bgClasses="desc-box"
              img={shopMeData[3].img}
              alt={"alt text here"}
              path="products"
              params={{tags:[shopMeData[3].tag]}}
            />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="centered flex-v stretch">
      {/* Featured Shop Here */}
      <div className="gradient-bg banner">
        {trendingShop!==undefined &&
              <ShopNow
              headerMsg={trendingShop.shop_name}
              headerSize={1}
              bgClasses="transparent"
              img={trendingShop.default_photo}
              alt={"alt text here"}
              path={`shop/${trendingShop.shop_name}`}
              state={{id:trendingShop.id}}
            />}
      </div>
      {/* Shop Nows go here */}
      {shopMeData.length > 1 ? makeShopMe():<h2>Shop Me</h2>}
      <div className="light-bg force-fill-width outline-black">
        <h2>Our Trendy Products</h2>
      </div>
      {trendData.length > 1 ? makeButtons() : <h3>All</h3>}
      <Products data={productData} />
    </div>
  );
}

export default Home;
