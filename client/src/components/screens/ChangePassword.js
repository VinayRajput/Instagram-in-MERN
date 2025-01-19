import React, { useState } from 'react';
import M from 'materialize-css';
import * as Util from '../../shared/Utils';
import { useParams, useHistory } from 'react-router-dom';
import axiosInstance from "../../services/axios";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const { token } = useParams();
  const history = useHistory();
  const changePassword = () => {
    if (password === "") {
      return M.toast({ html: "Please enter your new password", classes: "red lighten-1" })
    }

    if (password !== repeatPassword) {
      return M.toast({ html: "Repeat password does not match", classes: "red lighten-1" })
    }
    const Data = JSON.stringify({ token: token, password: password });
    axiosInstance.post("/changePassword", Data)
    .then(data => {
      if (data.error) {
        return M.toast({ html: `Error occurred: ${data.error}`, classes: "red lighten-1" });
      }
      M.toast({ html: data.message, classes: "green lighten-1" })
      history.push("/login");
    })
}
return (
  <div>
    <div className="row">
      <div className="input-field col s12">
        <h5> Change your passsword</h5>
      </div></div>
    <div className="row">
      <div className="input-field col s12">
        <input id="password" type="password" placeholder="" className="validate"
          value={password} onChange={e => setPassword(e.target.value)}
          required
        />
        <label htmlFor="password">Enter your new password</label>
      </div>
      <div className="input-field col s12">
        <input id="password" type="password" placeholder="" className="validate"
          value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)}
          required
        />
        <label htmlFor="password">Re-enter your new password</label>
      </div>
      <div className="input-field col s12">
        <button className="btn waves-effect waves-light" type="button" name="action" onClick={changePassword}>Change Password
        <i className="material-icons right">keyboard_return</i>
        </button>
      </div>
    </div></div>)
}

export default ChangePassword;