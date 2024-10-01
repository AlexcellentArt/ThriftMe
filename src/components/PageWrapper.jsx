import thriftmeLogo from "/src/assets/ThriftMeLogo.svg";
import Navigations from "./Navigations";
import {HeaderContext} from "./HeaderContext"
import {useContext,useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
function PageWrapper({children}) {
  const {additonalContent,setAdditonalContent} = useContext(HeaderContext)
  const {token,isAdmin,autoLogin} = useContext(AuthContext);
  // check if user has token on first load
  // useEffect(() => {
  //   checkForLocalToken()
  // }, []);
  let location = useLocation()
  // effect cleans up additonal context from previous page
  useEffect(() => {
    setAdditonalContent(undefined)
  }, [location]);
  return (
    <body>
      <header className="force-fill-width flex-v">
        <div className="flex-h force-fill-width">
          <img src={thriftmeLogo} className="logo hover" alt="ThriftMe logo" />
          <Navigations/>
        </div>
        <div className="flex-h align-items-center stretch center-text">{additonalContent !== undefined&&additonalContent}</div>
      </header>
      <main>{children}</main>
      <footer>This is A Footer in PageWrapper. If you see this</footer>
    </body>
  );
}

export default PageWrapper;
