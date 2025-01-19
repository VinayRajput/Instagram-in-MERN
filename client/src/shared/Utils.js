import {APPLICATION_JSON, CLOUDINARY_UPLOAD_URL, CONTENT_TYPE} from "./AppConstants";
import {axiosOnly} from "../services/axios";
export const postMethod = (url, data, hdr) => {
    const headers = hdr || {
      [CONTENT_TYPE]: APPLICATION_JSON,
      "Authorization":"Bearer "+localStorage.getItem("user")
    }
    return fetch(process.env.REACT_APP_API_URL+url, {
      method: "POST",
      headers: headers,
      body: data
    })
  };
  export const testEmail = (email) => {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email));

  };
  export const validateEmail = (email) => {
    let msg;
    if (email === "") { msg = "Please enter your email id"; }
    console.log(email);
    if (email !== "" && !testEmail(email)) { msg = "Invalid Email"; }

    return msg
  }
  export const toggleClass = (el, toAdd, toRemove) => {
    if(!el) return false;
    let classes = el.className.split(" ");
    if (el.className.indexOf(toAdd) === -1) {
      classes.push(toAdd);
    }
    if (toRemove) {
      classes = classes.filter((clas) => {
        return (clas !== toRemove)
      })
    }
    classes = classes.join(" ");
    el.className = classes;
  }

  export const uploadPic = (image, callback) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "vinkrins");
    axiosOnly.post(CLOUDINARY_UPLOAD_URL, data, {})
    .then(response => {
      callback(response);
    }).catch(e => {
      console.log(e);
    })
  }

  export const getCookieByName = (cname) => {
    let cookieValue = document.cookie;

    if (cookieValue.length === 0) {
      return '';
    } else {
      let foundCookieValue = cookieValue
          .split('; ')
          .find((row) => row.startsWith(cname + '='));
      if (foundCookieValue !== undefined) {
        cookieValue = foundCookieValue.split('=')[1];
      } else {
        return '';
      }
      return cookieValue;
    }
  }

