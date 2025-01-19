import {ACTION_CLEAR, ACTION_UPDATE, ACTION_USER, USER} from "../shared/AppConstants";

export const initialState = null;

export const reducer = (state, action) => {

  switch(action.type){
    case ACTION_USER:
      return {...initialState, ...action.payload}
    case ACTION_CLEAR:
      return null;
    case ACTION_UPDATE:
      localStorage.setItem(USER,JSON.stringify(action.payload));
      return {...initialState, ...action.payload}
    default:
      return state 
  }

  /*   
  if (action.type === "USER") { 
    return action.payload
  } 
  if(action.type === "CLEAR"){
    return null;
  }
  return state 
  */

}