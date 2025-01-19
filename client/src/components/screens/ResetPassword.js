import React, { useState, } from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';
import * as Util from '../../shared/Utils';
import axiosInstance from "../../services/axios";


const ResetPassword = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const resetPassword = () => {
    let msg = Util.validateEmail(email)
    if (msg)
      return M.toast({ html: msg, classes: "#ef5350 red lighten-1" });
    const Data = JSON.stringify({
      email
    });

    axiosInstance.post("/resetPassword", Data)
      .then(({data}) => {
        if (data.error)
          M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
        else {
          M.toast({ html: data.message, classes: "#a5d6a7 green lighten-3" });
          history.push("/login");
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
                <button className="btn waves-effect waves-light" type="button" name="action" onClick={resetPassword}>Reset Password
              <i className="material-icons right">keyboard_return</i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>)
}

export default ResetPassword;