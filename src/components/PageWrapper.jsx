import { AuthContext } from "./AuthContext";
import { useContext } from "react";
function PageWrapper() {
  // setState searchTags, should be an array of strings
  const { token } = useContext(AuthContext);
  // You are gonna want an input type search inside the div. Next to it you are gonna want a button with # inside it.
  // setState stringArray
  // relevant docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search
  return (
    <>
      <header>
        <div>
          <img src={thriftmeLogo} className="logo hover" alt="ThriftMe logo" />
        </div>
        <Navigations/>
      </header>
      <main></main>
      <footer>This is A Footer in PageWrapper. If you see this</footer>
    </>
  );
}

export default PageWrapper;
