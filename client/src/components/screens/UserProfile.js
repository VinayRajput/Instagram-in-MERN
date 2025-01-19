import React, { useEffect, useState, useContext, useRef } from 'react';
import { UserContext } from "../../App";
import { useParams } from 'react-router-dom';
import * as Util from '../../shared/Utils';
import axiosInstance from '../../services/axios';
import M from 'materialize-css';

const UserProfile = (props) => {
  const [userProfile, setProfile] = useState({ user: {}, posts: [] });
  const { state, dispatch } = useContext(UserContext);
  const [following, isItFollowing] = useState(false);
  const { userid } = useParams();
  const followBtn = useRef(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    axiosInstance.get(`/user/${userid}`, {
      signal: signal,
    })
      .then(({data}) => {
        if (data?.error) {
          setProfile(null);
          M.toast({ html:`Some error occurred while fetching user profile, please try after some time`,classes:"red lighten-1" })
        } else {
          const {user:User} = data;
          setProfile(data);
          let user = JSON.parse(localStorage.getItem("user"));
          if (user && User?.followers.includes(user.id)) {
            isItFollowing(true);
            Util.toggleClass(followBtn.current, 'red', 'blue');
          }
        }
      })

    return function cleanUp () {
      abortController.abort();
    }
  }, [userid]);

  /* useEffect(() => {
    console.log('state',state, userProfile.user.followers)
    if(userProfile.user.toString !=="{}" && userProfile.user.followers.include(state.id)) 
    {
      isItFollowing(true);
      Util.toggleClass(followBtn.current, 'red', 'blue');
    }
    
  }, [state, userProfile.user.followers]); */

  const follow = () => (following) ? followUser(false) : followUser(true);
  const updateUsers = (data) => {
    data.loggedInUser.id = data.loggedInUser._id;
    data.followedUser.id = data.followedUser._id;
    setProfile((prevState) => {
      return {
        ...prevState,
        user: data.followedUser
      }
    });
    data.loggedInUser.id = data.loggedInUser._id;
    dispatch({ type: "UPDATE", payload: data.loggedInUser })
  }
  const followUser = (follow) => {
    axiosInstance.put("/follow", {
      method: "PUT",
      data: { followId: userid, follow:follow }
    })
      .then(res => {
        console.log(res);
        isItFollowing(follow);
        updateUsers(res.data);
        Util.toggleClass(followBtn.current,
          follow ? 'red' : 'blue',
          follow ? 'blue' : 'red');
      })
  }

  return (
    (!userProfile?.user?.name) ? <h4 className="center-align">Loading...</h4> :
      <div>

        <div className="row">
          <div className="col s8 push-s2">
            <div className="card">
              <div className="card-content">
                <div className="card-image profile left" style={{ marginRight: 40 }}>
                  <img alt="" src={userProfile.user.userPic} />
                </div>
                <h4 className="card-title">
                  <div className={"card-title"}>{userProfile.user.name ? userProfile.user.name : "Loading..."}</div>
                  {(state && state.id !== userProfile.user._id) ?
                    <button ref={followBtn} className="btn waves-effect waves-light blue" onClick={follow}>
                      {
                        (following)
                          ? "unfollow"
                          : "follow"
                      }</button>
                    : ""
                  }
                </h4>
                <h6 className="card-title"><a className="small" href={`mailto${userProfile.user.email}`}>{userProfile.user.email}</a></h6>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h6>{userProfile.posts.length} posts</h6>
                  <h6>{userProfile?.user?.followers.length} Follower {userProfile.user.followers.length > 1 ? 's' : ''}</h6>
                  <h6>{userProfile?.user?.following.length} Following</h6>
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
                            <i className="material-icons" data-state-id={state ? state.id : ""} data-liked={state ? !!item.likes.includes(state.id) : ""} >favorite</i>
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