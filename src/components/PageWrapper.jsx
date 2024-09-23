import thriftmeLogo from "/src/assets/ThriftMeLogo.svg";
import Navigations from "./Navigations";
function PageWrapper({children}) {
  return (
    <>
      <header>
        <div>
          <img src={thriftmeLogo} className="logo hover" alt="ThriftMe logo" />
        </div>
        <Navigations/>
      </header>
      <body>{children}</body>
      <footer>This is A Footer in PageWrapper. If you see this</footer>
    </>
  );
}

export default PageWrapper;
