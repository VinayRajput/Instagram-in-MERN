import React, { useEffect, useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css'
 
const Following = () => {
   const history = useHistory();

   const [listing, setListing] = useState([]);
   const { state } = useContext(UserContext);
   useEffect(() => {
      const abortController = new AbortController();
      const signal = abortController.signal;
      fetch("/getSubsribedPosts", {
         signal: signal,
         headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
         }
      }).then(res => res.json())
         .then((data) => {
            console.log(data.posts);
            setListing(data.posts);
         })
      return function cleanUp () {
         abortController.abort()
      }
   }, []);

   const toggleLike = (id, postedBy, obj) => {
      let toggled = (obj.dataset.liked === "true") ? false : true;
      fetch("/toggleLike", {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("jwt")
         },
         body: JSON.stringify({
            postId: id,
            postedBy: postedBy,
            like: toggled
         })
      })
         .then(r => r.json())
         .then(result => {
            const newData = listing.map((item) => {
               if (item._id === result._id) {
                  if (result.likes.includes(state.id))
                     obj.dataset.liked = toggled;
                  return result
               } return item;
            });

            setListing(newData);
         });
   }

   const makeComment = (textField, postId) => {
      fetch("/comment", {
         method: "PUT",
         headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("jwt")
         },
         body: JSON.stringify({
            postId: postId,
            text: textField.value
         })
      })
      .then(res => res.json())
      .then((result) => {
            const newData = listing.map(item => {
               if (item._id === result._id) {
                  textField.value="";
                  return result;
               } else {
                  return item;
               }
            })
            setListing(newData);
         })
         .catch(e=>{
            M.toast({ html: "Some error occurred, please try again.", classes: "#ef5350 red lighten-1" });
            console.log(e)
         })
   } 

   const deletePost = (e,id)=>{
      e.preventDefault();
      fetch(`/delete/${id}`,{
         method:"DELETE",
         headers:{
            "Content-Type":"application/json",
            "authorization":`Bearer ${localStorage.getItem("jwt")}`
         }
      })
      .then(res=>res.json())
      .then(result=>{
         if(!!result.error){
            M.toast({html:`Error Occurred: ${result.error}`})
         } else {
            M.toast({html:result.message});
            const newData = listing.filter(item=>{
               return (item._id !== id)
            })
            setListing(newData);
         }

      })
      .catch(e=>{
         M.toast({html:`Error Occurred: ${e}`})
      })
   }

   const showListings = () => {

      if (!!localStorage.getItem("jwt")) {
         return (
            listing.map((item, key) => {
               return (
                  <div className="card col s6 home-card" key={item._id}>
                     <div className="card home-card">
                        <div className="card-content">
                        {
                           (item.postedBy._id === state.id)
                           ? 
                           <button className="material-icons right red-text"  onClick={(e)=>deletePost(e,item._id)} >delete</button>
                           : ""
                        }
                           
                           <h5>{item.title}</h5></div>
                        <div className="card-image">
                           <img alt="" src={item.photo} />
                        </div>
                        <div className="card-content">
                           <span className="pointer" onClick={(e) => {e.preventDefault(); toggleLike(item._id, item.postedBy._id, e.target)}} >
                              <i className="material-icons" data-state-id={state.id} data-liked={!!item.likes.includes(state.id)} >favorite</i>
                           </span>

                           <h6>{item.likes.length} likes</h6>
                           <h6>{item.title}</h6>
                           <p>By  
                              {
                              (item.postedBy._id !== state.id) 
                              ? 
                                 <Link to={"/profile/"+item.postedBy._id}> {item.postedBy.name}</Link>
                              :
                                 <Link to="/profile/"> {item.postedBy.name}</Link>
                              }
                           
                           </p>
                           <div className="input-field">
                              <form onSubmit={(e) => {
                                 e.preventDefault();
                                 const txtField = e.target.querySelector('input');
                                 makeComment(txtField, item._id);
                              }}>
                                 <input id={"addcomment" + item._id} type="text" className="validate" />
                                 <label htmlFor={"addcomment" + item._id}>add a comment</label>
                              </form>  
                           </div>
                           {
                              item.comments.map(comment=>{
                                 return(
                                    <div key={comment._id}>
                                    <h6><span>Posted By: {comment.postedBy.name}</span></h6>
                                    <div>{comment.text}</div>
                                    </div>
                                 )
                              })
                           }
                        </div>
                     </div>
                  </div>
               )
            })
         )
      } else {
         history.push("/login");
      }
   }
   return (<div>
      <div className="home">
         <div className="row">
            <div className="col s8 push-s2" >
               {
                  showListings()
               }
            </div></div></div>
   </div>)
}
export default Following