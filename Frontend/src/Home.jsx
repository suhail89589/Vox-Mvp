import React from "react";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks"; 
import Upload from "./components/Upload";

const Home = () => {
  return (
    <>
      
      <Hero />

     
      <HowItWorks />

      
      <div id="upload-section">
        <Upload />
      </div>
    </>
  );
};

export default Home;
