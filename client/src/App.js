import React, { Component } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Landing from './components/Layout/Landing';
import './App.css';


class App extends Component {
  render() {
    return (
      <div >
        <Navbar/>
        <Landing/>
        <Footer/>
      </div>
    );
  }
}

export default App;
