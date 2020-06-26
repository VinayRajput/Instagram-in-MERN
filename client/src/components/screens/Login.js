import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App'
import M from 'materialize-css';
import Util from '../../Utils';


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

    Util.postMethod("/signin", Data)
      .then(res => res.json())
      .then((data) => {
        if (data.error)
          M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
        else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log(data);
          dispatch({ type: "USER", payload: data.user });
          //M.toast({ html: data.message, classes: "#a5d6a7 green lighten-3" });
          history.push("/")
        }
      })
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