import Video from "./components/video";
import Footer from "./components/footer";
import { AnimatePresence } from "framer-motion";
import Home from "./components/home";
import PageNotFound from "./components/404";
import { Route, Link, Routes, useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();
  return (
    <>
      <div class="container">
        <div class="flex-navbar">
          <Link to="/">home</Link>
        </div>
        <div class="flex-content">
          <AnimatePresence initial={false} mode={"wait"}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </AnimatePresence>
          <Video />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default App;
