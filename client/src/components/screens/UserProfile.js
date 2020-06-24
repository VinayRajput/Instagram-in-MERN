import React, { useEffect, useState, useContext, useRef } from 'react';
import { UserContext } from "../../App";
import { useParams } from 'react-router-dom';
import Util from '../../Utils';

const UserProfile = (props) => {
  const [userProfile, setProfile] = useState({ user: {}, posts: [] });
  const { state, dispatch } = useContext(UserContext);
  const [following, isItFollowing] = useState(false);
  const { userid } = useParams();
  const followBtn = useRef(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetch(`/user/${userid}`, {
      signal: signal,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(r => r.json())
      .then((data) => {
        if (data.error) {
          setProfile(null);
        } else {
          console.log('data', data);
          setProfile(data);
          let user  = JSON.parse(localStorage.getItem("user"));
          if(data.user.followers.includes(user.id)){
            isItFollowing(true);
            Util.toggleClass(followBtn.current, 'red', 'blue');
          }
        }
      })

    return function cleanUp () {
      abortController.abort();
    }
  }, []);
  
  /* useEffect(() => {
    console.log('state',state, userProfile.user.followers)
    if(userProfile.user.toString !=="{}" && userProfile.user.followers.include(state.id)) 
    {
      isItFollowing(true);
      Util.toggleClass(followBtn.current, 'red', 'blue');
    }
    
  }, [state, userProfile.user.followers]); */

  const follow = () => {
    (following)
      ?
      unFollowUser()
      :
      followUser()
  }

  const updateUsers=(data)=>{
    data.loggedInUser.id = data.loggedInUser._id;
    data.followedUser.id = data.followedUser._id;
    setProfile((prevState)=>{
      return{
        ...prevState,
        user:data.followedUser
      }
    });
    data.loggedInUser.id = data.loggedInUser._id;
    dispatch({type:"UPDATE",payload:data.loggedInUser})
  }

  const followUser = () => {
    fetch("/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({ followId: userid })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        isItFollowing(true);
        updateUsers(data);
        Util.toggleClass(followBtn.current, 'red', 'blue');
      })
  }

  const unFollowUser = () => {
    fetch("/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({ unfollowId: userid })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        isItFollowing(false);
        updateUsers(data);
        Util.toggleClass(followBtn.current, 'blue', 'red');
      })
  }

  return (
    (!userProfile.user.name) ? <h4 className="center-align">Loading...</h4> :
      <div>
        <div className="row">
          <div className="col s8 push-s2">
            <div className="card">
              <div className="row">
                <div className="col s4  ">
                  <div className="card-image profile ">
                    <img alt="" src="https://instagram.fdel20-1.fna.fbcdn.net/v/t51.2885-15/e35/97882461_696728487772904_5761479277429123452_n.jpg?_nc_ht=instagram.fdel20-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=P_F1dr0VAyQAX8K5JOE&oh=270970491869457f9a8f2f8cc31389f5&oe=5EC66F46" />
                  </div>
                </div>
              </div>
              <div className="card-content">
                <h4 className="card-title">{userProfile.user.name ? userProfile.user.name : "Loading..."} <button ref={followBtn} className="btn waves-effect waves-light blue" onClick={follow}>
                  {
                    (following)
                      ? "unfollow"
                      : "follow"
                  }</button></h4>
                <h6 className="card-title"><a className="small" href={`mailto${userProfile.user.email}`}>{userProfile.user.email}</a></h6>
                <div style={{ display:  'flex', justifyContent: 'space-between' }}>
                  <h6>{userProfile.posts.length} posts</h6>
                  <h6>{userProfile.user.followers.length} Follower {userProfile.user.followers.length>1 ? 's' :''}</h6>
                  <h6>{userProfile.user.following.length} Following</h6> 
                </div>



                <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s8 push-s2" >
            <div className="row">
              {
                userProfile.posts.map((item, key) => {
                  return (
                    <div className="card col s6 home-card" key={item._id}>
                      <div className="card home-card">
                        <div className="card-content">
                          {/* 
                         (item.postedBy._id === state.id)
                         ? 
                         <button className="material-icons right red-text"  onClick={(e)=>deletePost(e,item._id)} >delete</button>
                         : "" */
                          }

                          <h5>{item.title}</h5></div>
                        <div className="card-image">
                          <img alt="" src={item.photo} />
                        </div>
                        <div className="card-content">
                          {/* onClick={(e) => {e.preventDefault(); toggleLike(item._id, item.postedBy._id, e.target)}} */}
                          <span className="pointer"  >
                            <i className="material-icons" data-state-id={state.id} data-liked={!!item.likes.includes(state.id)} >favorite</i>
                          </span>

                          <h6>{item.likes.length} likes</h6>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div></div>
      </div>)
}

export default UserProfile;