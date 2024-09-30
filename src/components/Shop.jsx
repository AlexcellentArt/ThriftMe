import Products from "./Products";
import SearchBar from "./SearchBar";
import { AuthContext } from "./AuthContext";
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
function Shop() {
  // const {AutoHeader} = useContext(AuthContext);
  const { state } = useLocation();
  console.log(state);
  const { id } = state;
  const [search, setSearch] = useState({ seller_id: 1 });
  const [shopData, setShopData] = useState({
    seller_id: 1,
    items: [],
    shop_name: "Shop",
  });
  const [shopID, setShopId] = useState(1);

  useEffect(() => {
    // using use location to hide shop id from path
    // console.log("ID IS "+id)
    // setShopId(id)
    // setSearch({seller_id:id})
    setSearch({ seller_id: id });
    setShopId(id);
    async function getContent() {
      const response_shop = await fetch("http://localhost:3000/api/user/shop/"+id, {
        method: "POST",
        body: { id: id },
      });
      const shop = await response_shop.json();
      setShopData(shop);
      console.log(shop);
    }
    getContent();
  }, [id]);
  return (
    <div className="shop centered gradient-bg">
      <div className="flex-v">
        <div><h2>Search {shopData.shop_name}</h2></div>
        <SearchBar
          setLocalSearch={setSearch}
          forcedParams={{ seller_id: shopID ? shopID : 0 }}
        />
        <Products search={search} headerText={shopData.shop_name} />
      </div>
    </div>
  );
}

export default Shop;
