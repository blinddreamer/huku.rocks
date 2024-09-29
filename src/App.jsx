import Video from "./components/video";
import Footer from "./components/footer";
import { AnimatePresence } from "framer-motion";
import Monitor from "./components/monitorpage";
import Home from "./components/home";
import PageNotFound from "./components/404";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import PageNotFound from "./assets";

const App = () => {
  const location = useLocation();
  return (
    <>
      <div class="container">
        <div class="flex-navbar">
          <Link to="/">home</Link>
          <Link to="/monitor">monitor</Link>
        </div>
        <div class="flex-content">
          <AnimatePresence initial={false} mode={"wait"}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/monitor" element={<Monitor />} />
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
