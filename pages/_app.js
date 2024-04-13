import "../styles/globals.css";

//Internal Import
import { ZBlockProvider } from "../context/ZBlockContext";
import { NavBar } from "../components/index";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <ZBlockProvider>
        <NavBar />
        <Component {...pageProps} />
      </ZBlockProvider>
    </div>
  );
}

export default MyApp;
