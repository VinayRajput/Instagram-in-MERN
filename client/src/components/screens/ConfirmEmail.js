import React, { useEffect } from 'react';
import M from 'materialize-css';
import { useParams, useHistory } from 'react-router-dom';
import axiosInstance from "../../services/axios";

const ConfirmEmail = () => {
  const { token } = useParams();
  const history = useHistory();
  useEffect(()=>{
    debugger;
    const data = JSON.stringify({token:token});
    axiosInstance.post("/emailConfirmation",data)
    .then(response=>{
      M.toast({ html: response.message, classes: "#a5d6a7 green lighten-3" });
      history.push("/login");
    })
  },[ history, token ])


return (
  <div></div>)
}

export default ConfirmEmail;