import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Products from "./Products";
import { HeaderContext } from "./HeaderContext";
import { ShopNow } from "./ShopNow";

function Home() {
  const { setAdditonalContent } = useContext(HeaderContext);
  const { token, getUser } = useContext(AuthContext);
  const [productData, setProductData] = useState([{}]);
  const [trendingShop, setTrendingShop] = useState(undefined);
  const [shopMeData, setShopMeData] = useState([{ tag: "", img: "" }]);
  const [trendData, setTrendData] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // effect to get products
  useEffect(() => {
    async function getTrendyProducts() {
      try {
        const user = await getUser();
        if (!user) {
          throw new Error("Not Logged In. Showing Generic Instead.");
        }
        const browsing_history = user.browsing_history;
        // make call to get all data that has one of the tags for the all view
        const response = await fetch("/api/item/search", {
          method: "POST",
          body: { tags: browsing_history.looked_at_tags },
        });
        const data = await response.json();
        // view will be all at first
        setProductData(data);

        // get data for trending views, max 5
        const tagData = await makeTagData(
          data.slice(5).map((obj) => {
            return obj.tags[0];
          })
        );
        //... and add at the start all
        tagData.unshift({ tag: "All", data: data });
        // set trending data
        await setTrendData(tagData);
        // create shop me data
        await makeShopMeData(tagData);
      } catch (error) {
        const genData = await getGenericProducts();
        return genData;
      }
    }

    async function getGenericProducts() {
      try {
        const response = await fetch("/api/item");
        const genericData = await response.json();
        // create trend data, getting at max 5 tags and data from 5 items
        const tagData = await makeTagData(
          genericData.slice(5).map((obj) => {
            return obj.tags[0];
          })
        );
        //... and add at the start all
        tagData.unshift({ tag: "All", data: genericData });
        setTrendData(tagData);
        await setProductData(genericData);
        await makeShopMeData(tagData);
        return genericData;
      } catch (error) {
        setError("Website server unable to be accessed. We apologize for the inconvenience.")
        setLoading(false);
      }
    }

    async function makeTagData(input_data) {
      const tagData = [];
      const loopLength = input_data.length < 5 ? input_data.length : 5;
      for (let index = 0; index < loopLength; index++) {
        try {
          const tag = input_data[index];
          const response = await fetch(
            "/api/item/search",
            { method: "POST", body: { tags: [tag] } }
          );
          const data = await response.json();
          tagData.push({ name: tag, data: data });
        } catch (error) {}
      }
      return tagData;
    }
    async function makeShopMeData(tag_data) {
      const seller_id = tag_data.shift().data[0].seller_id;
      // first seller in data for first in trendData is made a trending shop and popped off...
      const response_shop = await fetch(
        `/api/user/shop/${seller_id}`,
        {
          method: "POST",
          body: { id: seller_id },
        }
      );
      const shop = await response_shop.json();
      shop["default_photo"] = shop.items[0].default_photo;
      setTrendingShop(shop);
      // next 4 are made into the smaller shop me
      const shopMeTags = tag_data.map((trend) => {
        return {
          tag: trend.name,
          img: trend.data[Math.floor(Math.random() * trend.data.length)]
            .default_photo,
        };
      });
      setShopMeData(shopMeTags);
      setLoading(false);
    }
    // if the user is logged in or not can be determined by if the token is null or not
    // fetch generic products when not logged in
    token ? getTrendyProducts() : getGenericProducts();
  }, []);
  if (loading) return <h1 className="white-bg  merriweather-black-italic large-text text-dark">Loading the home page...</h1>;
  if (error) return <h1>Error: {error}</h1>;
  const makeButtons = () => {
    const buttons = [];
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
  function makeShopMe() {
    return (
      <>
        {/* Featured Shop Here */}

        <div className="gradient-bg banner">
          {trendingShop !== undefined && (
            <ShopNow
              headerMsg={trendingShop.shop_name}
              headerSize={2}
              subheader={trendingShop.shop_tagline}
              bgClasses="transparent"
              img={trendingShop.default_photo}
              alt={"alt text here"}
              path={`shop/${trendingShop.shop_name}`}
              state={{ id: trendingShop.id }}
            />
          )}
        </div>
        {/* Shop Nows go here */}
        <div className="flex-h stretch force-fill-width">
          <ShopNow
            headerMsg={shopMeData[0].tag}
            z
            headerSize={2}
            bgClasses="desc-box"
            img={shopMeData[0].img}
            alt={"alt text here"}
            path="products"
            params={{ tags: [shopMeData[0].tag] }}
          />
          <div className="flex-v">
            <ShopNow
              headerMsg={shopMeData[1].tag}
              headerSize={3}
              bgClasses="desc-box"
              img={shopMeData[1].img}
              alt={"alt text here"}
              path="products"
              params={{ tags: [shopMeData[1].tag] }}
            />
            <div className="flex-h">
              <ShopNow
                headerMsg={shopMeData[2].tag}
                headerSize={3}
                bgClasses="desc-box"
                img={shopMeData[2].img}
                alt={"alt text here"}
                path="products"
                params={{ tags: [shopMeData[2].tag] }}
              />
              <ShopNow
                headerMsg={shopMeData[3].tag}
                headerSize={4}
                bgClasses="desc-box"
                img={shopMeData[3].img}
                alt={"alt text here"}
                path="products"
                params={{ tags: [shopMeData[3].tag] }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="home">
      {shopMeData.length > 1 ? makeShopMe() : <h2>Shop Me</h2>}
      <div className="light-bg force-fill-width outline-black">
        <h2>Our Trendy Products</h2>
      </div>
      {trendData.length > 1 ? makeButtons() : <h3>All</h3>}
      <Products data={productData} />
    </div>
  );
}

export default Home;
