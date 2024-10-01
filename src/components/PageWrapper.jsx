import thriftmeLogo from "/src/assets/ThriftMeLogo.svg";
import Navigations from "./Navigations";
import { HeaderContext } from "./HeaderContext";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../index.css";

function PageWrapper({ children }) {
  const { additonalContent, setAdditonalContent } = useContext(HeaderContext);
  let location = useLocation();

  // effect cleans up additonal context from previous page
  useEffect(() => {
    setAdditonalContent(undefined);
  }, [location]);

  return (
    <body>
      <header className="force-fill-width flex-v">
        <div className="flex-h force-fill-width">
          <img src={thriftmeLogo} className="logo hover" alt="ThriftMe logo" />
          <Navigations />
        </div>
        <div className="flex-h align-items-center stretch center-text">
          {additonalContent !== undefined && additonalContent}
        </div>
      </header>

      <main>{children}</main>

      <footer>
        {/* <div class="scrolling-container">
          <p class="scrolling-ticker">
            <span>Today's Deals: 50% off all winter coats!</span>
            <span>Buy one, get one free on shoes! </span>
            <span>Free shipping on orders over $30! </span>
            <span>
              Check out our Instagram for our morning catches of the day
              @ThriftMe!
            </span>
          </p>
        </div> */}

        <marquee class="scrolling-container">
          <p class="scrolling-ticker">
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
    </body>
  );
}

export default PageWrapper;
