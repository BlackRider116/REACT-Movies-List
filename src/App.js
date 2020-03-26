import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import FilmContainer from './components/Film/FilmContainer.jsx'
import Bookmarks from './components/Bookmarks/Bookmarks.jsx'

function App() {
  return (
    <div className="App">
      <Header />
      <div>
        <Switch>
          <Route exact path="/"><Redirect to="/films" /></Route>
          <Route path='/films' render={() => <FilmContainer />} />
          <Route path='/bookmarks' render={() => <Bookmarks />} />
        </Switch>
      </div>
    </div>
  );
}

export default withRouter(App);
