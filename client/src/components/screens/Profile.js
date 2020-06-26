import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from "../../App";
import Util from '../../Utils';
import M from 'materialize-css'

const Profile = () => {
   const [profileData, setProfileData] = useState([]);
   const { state, dispatch } = useContext(UserContext)
   useEffect(() => {
      const abortController = new AbortController();
      const signal = abortController.signal;
      fetch("/myPosts", {
         signal: signal,
         headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
         }
      }).then(r => r.json())
         .then((data) => {
            console.log(data.myPosts);
            setProfileData(data.myPosts);
         })

      return function cleanUp () {
         abortController.abort();
      }
   }, []);

   const updatePic = (file) => {
      Util.uploadPic(file, (response) => {
         const newState = {
            ...state,
            userPic: response.url
         }
         dispatch({ type: "UPDATE", payload:newState});
         fetch("/updatePicUrl",{
            method:"POST",
            headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("user")
            },
            body:JSON.stringify({id:state.id, userPic:response.url})
         })
         .then(res=>res.json())
         .then(res=>{
           M.toast({html:res.message, classes: "#a5d6a7 green lighten-3" });
         });
      });
   }

   return (<div>
      <div className="row">
         <div className="col s8 push-s2">
            <div className="card">
               <div className="row">
                  <div className="col s4 center  ">
                     <div className="card-image profile ">

                        <img alt="" src={(state && state.userPic) ? state.userPic : ""} />
                     </div>
                     <div className="updatePicButton">
                        <input type="file" style={{ opacity: 0, zIndex: 2, position: "absolute", display: "block", width: 146, cursor: "pointer !important" }} className="btn btn-flat btn-small" onChange={(e) => {
                           updatePic(e.target.files[0])
                        }} />
                        <button className="btn btn-flat btn-small wave-effect waves-light grey light-3 middle-align"
                        >Update Picture</button>
                     </div>
                  </div>

               </div>
               <div className="card-content">
                  <div className="row">
                     <span className="col s12 card-title">{state ? state.name : "Loading..."}</span>
                     <div className="col s12">
                        {profileData.length || 0} Posts,  {state ? state.followers.length : ''} Followers, {state ? state.following.length : ''} Following
                        <br /><br />
                        <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="row">
         <div className="col s8 push-s2" >
            <div className="row">
               {
                  profileData.map((item) => {
                     return (
                        <div className="card col s4" key={item._id} >
                           <div className="card-image imgs">
                              <img alt="" src={item.photo} />
                           </div>
                        </div>
                     )
                  })
               }
            </div>
         </div></div>
   </div>)
}

export default Profile;