import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = ({ element }) => {
  return (
    <>
      <Navbar />
      <main>{element}</main>
      <Footer />
    </>
  );
};

export default App;
