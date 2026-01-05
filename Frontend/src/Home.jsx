import React from "react";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import Upload from "./components/Upload";

const Home = () => {
  return (
    <>
      <Hero />

      <HowItWorks />

      <div id="upload-section">
        <Upload />
        <Footer />
      </div>
    </>
  );
};

export default Home;
