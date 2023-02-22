import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import NavBar from './components/Navbar.js'
import { BrowserRouter, Route, useHistory, Switch } from 'react-router-dom';
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/createPost'
import { initialState, reducer } from './reducer/userReducer'
import UserProfile from './components/screens/UserProfile';
import Following from './components/screens/Following';
import ResetPassword from './components/screens/ResetPassword';
import ChangePassword from './components/screens/ChangePassword';
import ConfirmEmail from './components/screens/ConfirmEmail';


export const UserContext = createContext();


const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      //history.push("/");
      dispatch({ type: "USER", payload: user });
      console.log(user);
    } else if(!history.location.pathname.startsWith('/reset')){
      //history.push("/login");//
    }
  }, [dispatch, history.location.pathname]);

  return (<Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/profile" exact component={Profile} />
    <Route path="/createPost" component={CreatePost} />
    <Route path="/profile/:userid" exact component={UserProfile} /> 
    <Route path="/following/" exact component={Following} /> 
    <Route path="/resetPassword/" exact component={ResetPassword} /> 
    <Route path="/resetPassword/:token" component={ChangePassword} /> 
    <Route path="/confirmEmail/:token" component={ConfirmEmail} /> 
  </Switch>);
}
function App () {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Routing />
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
export default App;