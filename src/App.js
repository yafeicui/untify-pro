import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';
import './App.css';
import Index from './router';
// 引入axios
import { createHttp } from './http';
createHttp();

class App extends Component {
  render() {
    return (
      <Router>
        <Index />
      </Router>
    );
  }
}

export default App;
