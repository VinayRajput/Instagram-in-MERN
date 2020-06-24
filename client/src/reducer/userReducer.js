export const initialState = null;

export const reducer = (state, action) => {

  switch(action.type){
    case "USER":
      return action.payload
    case "CLEAR":
      return null;
    case "UPDATE":
      localStorage.setItem("user",JSON.stringify(action.payload));
      return action.payload
    case "DEFAULT":
      return state 
    /* 
    case "UPDATE":
      return {
        ...state,
        
      } 
    */
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