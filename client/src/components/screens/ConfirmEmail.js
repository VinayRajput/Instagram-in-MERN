import React, { useEffect } from 'react';
import M from 'materialize-css';
import Util from '../../Utils';
import { useParams, useHistory } from 'react-router-dom';

const ConfirmEmail = () => {
  const { token } = useParams();
  const history = useHistory();
  useEffect(()=>{
    debugger;
    const data = JSON.stringify({token:token});
    Util.postMethod("/emailConfirmation",data)
    .then(res=>res.json())
    .then(response=>{
      M.toast({ html: response.message, classes: "#a5d6a7 green lighten-3" });
      history.push("/login");
    })
  },[ history, token ])


return (
  <div></div>)
}

export default ConfirmEmail;