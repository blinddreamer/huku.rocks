import Animated from "./animated";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>huku.rocks</title>
        <meta name="description" content="huku.rocks - homepage" />
        <meta
          name="keywords"
          content="awesome, site, homepage, huku, huku.rocks, personal, personal website"
        />
        <meta property="og:title" content="huku.rocks" />
        <meta property="og:description" content="huku.rocks" />
        <meta property="og:image" content="./assets/logo512.png" />
      </Helmet>

      <Animated>
        <h1>huku.rocks</h1>
        <h2>coming soon-ish.</h2>
      </Animated>
    </>
  );
};

export default Home;
