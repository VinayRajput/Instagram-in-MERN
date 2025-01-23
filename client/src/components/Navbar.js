import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from "../App";
import M from 'materialize-css';
import {ToastContainer} from "react-toastify";
import axiosInstance from "../services/axios";
const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory()
  const userSearchModal = useRef(null);
  const [modalInstance, setModalInstance] = useState();
  const [keyword, setKeyword] = useState("");
  const [userResults, setUserResults] = useState([]);
  useEffect(() => {
    const instance = M.Modal.init(userSearchModal.current);
    setModalInstance(instance);
  }, [])
  const renderList = () => {
    if (state) {
      return [
        <li key="0"><i data-target="model-user-search" className="large material-icons modal-trigger black-text">search</i></li>,
        <li key="1"><Link to="/profile">Profile</Link></li>,
        <li key="2"><Link to="/createPost">Create Post</Link></li>,
        <li key="3">
          {
            (state && !!state.following.length)
              ?
              <Link to="/following">Following</Link>
              : ""
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

  const searchUsers = (keyword) => {
    const data = JSON.stringify({ keyword });
    setKeyword(keyword);
    if(keyword === "") return setUserResults(keyword) 
    
    Util.postMethod("/searchUser", data)
      .then(users => {
        setUserResults(users.response);
      })
  }
  return (
      <>
        <nav>
    <div className="nav-wrapper">
      <Link to="/" className="brand-logo">Instagram</Link>
      <ul id="nav-mobile" className="right hide-on-down">
        {renderList()}
      </ul>
    </div>

    <div id="model-user-search" className="modal black-text" ref={userSearchModal}>
      <div className="modal-content">
        <h4>Modal Header</h4>
        <div className="row">
          <div className="input-field col s12">
            <input id="setKeyword" type="text" className="validate" value={keyword} onChange={e => searchUsers(e.target.value)} required />
            <label htmlFor="setKeyword">Search User</label>


          </div>
        </div>
        <ul className="collection">
          {
            userResults ? userResults.map((user, i) => {
              return (
                <Link key={i} to={"/profile/" + ((state.id !== user._id) ? user._id : "")} onClick={() => {
                  modalInstance.close();
                }} >
                  <li className="collection-item" >{`${user.name} (${user.email})`}</li> </Link>)
            })
              : ""
          }
        </ul>
      </div>
      <div className="modal-footer">
        <button className="modal-close waves-effect waves-green btn-flat" onClick={() => {
          searchUsers("");
        }}>Close</button>
      </div>
    </div>
  </nav>
    <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
    />
  </>
  )
}
export default NavBar;