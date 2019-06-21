import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './containers/layout/Navbar';
import Landing from './containers/layout/Landing';
import Login from './containers/auth/Login';
import Register from './containers/auth/Register';
import store from './store';
import {Provider} from 'react-redux';
import Alert from './containers/layout/Alert';
import setAuthToken from './utils/setAuthToken';
import {loadUser} from './actions/auth';
import Dashboard from './containers/dashboard/Dashboard';
import PrivateRoute from './containers/routing/PrivateRouting';
import CreateProfile from './containers/profile-form/CreateProfile';
import EditProfile from './containers/profile-form/EditProfile';
import AddExperience from './containers/profile-form/AddExperience';
import AddEducation from './containers/profile-form/AddEducation';
import Profiles from './containers/profiles/Profiles';
import Profile from './containers/profile/Profile';
import Posts from './containers/posts/Posts';
import Post from './containers/post/Post';

import './App.css';

if(localStorage.token){
  setAuthToken(localStorage.token);
};

const App = () => {
  
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return(
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar/>
        <Route exact path='/' component={Landing}/>
        <section className='container'>
          <Alert/>
          <Switch>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/profiles' component={Profiles}/>
            <Route exact path='/profile/:id' component={Profile}/>
            <PrivateRoute exact path='/dashboard' component={Dashboard}/>
            <PrivateRoute exact path='/create-profile' component={CreateProfile}/>
            <PrivateRoute exact path='/edit-profile' component={EditProfile}/>
            <PrivateRoute exact path='/add-Experience' component={AddExperience}/>
            <PrivateRoute exact path='/add-Education' component={AddEducation}/>
            <PrivateRoute exact path='/posts' component={Posts}/>
            <PrivateRoute exact path='/posts/:id' component={Post}/>
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
)};

export default App;
