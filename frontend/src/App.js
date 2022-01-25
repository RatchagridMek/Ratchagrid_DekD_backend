import './App.css';
import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import Index from './pages/index';
import EditForum from './pages/edit-forum'

function App() {

  axios.defaults.baseURL = 'http://localhost:8000/';
  axios.defaults.headers.post['Accept'] = 'application/json';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  return (
    <Router>
        <Switch>
            <Route exact path="/" component={Index}/>
            <Route path="/editforum" component={EditForum}></Route>
        </Switch>
    </Router>
  );
}

export default App;
