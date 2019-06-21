import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './Components/Layout/Navbar';
import Landing from './Components/Layout/Landing';
import Login from './Components/auth/Login';
import Register from './Components/auth/Register';
import store from './store';
import {Provider} from 'react-redux';
import Alert from './Components/Layout/Alert';
import setAuthToken from './utils/setAuthToken';
import {loadUser} from './actions/auth';
import Dashboard from './Components/dashboard/Dashboard';
import PrivateRoute from './Components/routing/PrivateRouting';
import CreateProfile from './Components/profile-form/CreateProfile';
import EditProfile from './Components/profile-form/EditProfile';
import AddExperience from './Components/profile-form/AddExperience';
import AddEducation from './Components/profile-form/AddEducation';
import Profiles from './Components/profiles/Profiles';
import Profile from './Components/profile/Profile';
import Posts from './Components/posts/Posts';
import Post from './Components/post/Post';

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
