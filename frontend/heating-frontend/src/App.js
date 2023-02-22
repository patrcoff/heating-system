//import logo from './logo.svg';
import React, { useEffect, useState, useRef } from "react";
//import './App.css';
import ExternalJSON from "./components/external";
import CurrentTimes from "./components/heating-data";
import Footer from "./components/Footer"
import LogSection from "./components/LogSection";
//import Example from "./components/Example"


function App() {
  return(
    <>
    <div className="bg-gray-200 flex justify-center ">
      <CurrentTimes className="flex"/>
      <LogSection className="flex sm:text-center"/>
    </div>
    <div>
      <LogSection className="flex sm:text-center"/>
    </div>
    <Footer className=""/>
      
      {/*<ExternalJSON/>*/}
    </>

  )
}
//<CurrentTimes/>
//    <ExternalJSON/>
export default App;
