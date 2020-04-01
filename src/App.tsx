import React from 'react';
import './App.scss';
import Header from './components/Header/Header';
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import Movies from './components/Movies/Movies'
import Bookmarks from './components/Bookmarks/Bookmarks'

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/"><Redirect to="/films" /></Route>
        <Route path='/films' render={() => <Movies />} />
        <Route path='/bookmarks' render={() => <Bookmarks />} />
      </Switch>
    </div>
  );
}

export default withRouter(App);
