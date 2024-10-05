import thriftmeLogo from "/src/assets/ThriftMeLogo.svg";
import Navigations from "./Navigations";
import { HeaderContext } from "./HeaderContext";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function PageWrapper({children}) {
  const {additonalContent,setAdditonalContent} = useContext(HeaderContext)
  const {token,isAdmin,checkForLocalToken} = useContext(AuthContext);
  // check if user has token on first load
  let location = useLocation()
  // effect cleans up additonal context from previous page
  useEffect(() => {
    console.log("conent prior to reset: ", additonalContent)
    setAdditonalContent(null);
  }, [location]);
  useEffect(() => {
    console.log("additonal content changed!: ", additonalContent)
  }, [additonalContent]);
useEffect(() => {
  checkForLocalToken()
}, [token,isAdmin]);
  return (
    <div className="page">
      <header className="force-fill-width flex-v">
        <div className="flex-h force-fill-width align-items-center">
          <img src={thriftmeLogo} className="logo hover" alt="ThriftMe logo" />
          <Navigations />
        </div>
        {additonalContent !== null && additonalContent}
      </header>

      <main>{children}</main>

      <footer>
        <marquee className="scrolling-container">
          <p className="scrolling-ticker">
            <span>Today's Deals: 50% off all winter coats!</span>
            <span>Buy one, get one free on shoes! </span>
            <span>Free shipping on orders over $30! </span>
            <span>
              Check out our Instagram for our morning catches of the day
              @ThriftMe!
            </span>
          </p>
        </marquee>
      </footer>
    </div>
  );
}

export default PageWrapper;
