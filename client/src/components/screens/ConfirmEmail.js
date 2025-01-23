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
      if(response?.data?.error)
        M.toast({ html: response?.data?.error, classes: "#a5d6a7 red lighten-3" });
      else {
        M.toast({html: response?.data.message, classes: "#a5d6a7 green lighten-3"});
      }
      setTimeout(()=>{
        history.push("/login");
      },2000)
    })
  },[ history, token ])


return (
  <div></div>)
}

export default ConfirmEmail;