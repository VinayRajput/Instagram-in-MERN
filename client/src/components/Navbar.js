import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from "../App";
const NavBar = () => {
  const { state,dispatch } = useContext(UserContext);
  const history = useHistory()
  const renderList = () => {
    if (state) {
      return [
        <li key="1"><Link to="/profile">Profile</Link></li>,
        <li key="2"><Link to="/createPost">Create Post</Link></li>,
        <li key="3">
        {
          (state && !!state.following.length) 
          ?  
          <Link to="/following">Following</Link>
          :    ""
        }
        </li>,
        <li key="4"><Link to="/#" onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            history.push("/");
          }}>
          Log Out</Link></li>
      ]
    } else {
      return [
        <li key="1"><Link to="/login">Login</Link></li>,
        <li key="2"><Link to="/signup">Signup</Link></li>
      ]
    }
  }

  return (<nav>
    <div className="nav-wrapper">
      <Link to={state ? "/" : "/login"} className="brand-logo">Instagram</Link>
      <ul id="nav-mobile" className="right hide-on-down">
        {renderList()}
      </ul>
    </div>
  </nav>)
}
export default NavBar;