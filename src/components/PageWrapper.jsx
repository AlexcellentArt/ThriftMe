import thriftmeLogo from "/src/assets/ThriftMeLogo.svg";
import Navigations from "./Navigations";
function PageWrapper({children}) {
  return (
    <body>
      <header>
        <div>
          <img src={thriftmeLogo} className="logo hover" alt="ThriftMe logo" />
        </div>
        <Navigations/>
      </header>
      <main>{children}</main>
      <footer>This is A Footer in PageWrapper. If you see this</footer>
    </body>
  );
}

export default PageWrapper;
