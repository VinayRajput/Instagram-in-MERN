import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App'
import M from 'materialize-css';
import axiosInstance from '../../services/axios';
import * as Util from '../../shared/Utils';
import {ACCESS_TOKEN, ACTION_USER, APPLICATION_JSON, USER} from "../../shared/AppConstants";


const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();
  const { dispatch } = useContext(UserContext);

  const Signin = () => {
    let msg = Util.validateEmail(email)
    if (msg)
      return M.toast({ html: msg, classes: "#ef5350 red lighten-1" });

    const Data = JSON.stringify({
      email,
      password
    });

    axiosInstance.post("/signin",Data,{
      headers:  {
        CONTENT_TYPE:APPLICATION_JSON
      }
    })
    .then(({data: {error, token, user}}) => {
      if(error) {
        M.toast({html: error, classes: "#ef5350 red lighten-1"});
        return;
      }

        localStorage.setItem(ACCESS_TOKEN, token);
        localStorage.setItem(USER, JSON.stringify(user));
        dispatch({ type: ACTION_USER, payload: user });
        history.push("/")
    })
    .catch((error)=>{
        M.toast({ html: error, classes: "#ef5350 red lighten-1" });
    });
  }

  return (
    <div className="card login">
      <div className="row">
        <div className="col s6 push-s3 center-align">
          <h1 className="ttl">Instagram</h1>
          <form className="col">
            <div className="row">
              <div className="input-field col s12">
                <input id="email" type="text" className="validate" value={email} onChange={e => setEmail(e.target.value)} required />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field col s12">
                <input id="password" type="password" className="validate"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required
                />
                <a href="/resetPassword" className="right">Forgot Password ?</a>
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-field col s12">
                <button className="btn waves-effect waves-light" type="button" name="action" onClick={Signin}>Login
              <i className="material-icons right">keyboard_return</i>
                </button>
              </div>
              <div className="input-field col s12">
                Don't have an account?, <Link to="/signup">SignUp here!</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>)
}

export default Login;