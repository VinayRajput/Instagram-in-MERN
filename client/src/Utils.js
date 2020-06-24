const Util = {
  postMethod: (url, data, hdr) => {
    const headers = hdr || {
      "Content-Type": "application/json"
    }
    return fetch(url, {
      method: "POST",
      headers: headers,
      body: data
    })
  },
  testEmail: (email) => {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email));

  },
  validateEmail: (email) => {
    let msg;
    if (email === "") { msg = "Please enter your email id"; }
    console.log(email);
    if (email !== "" && !Util.testEmail(email)) { msg = "Invalid Email"; }

    return msg
  },
  toggleClass: (el, toAdd, toRemove) => {
    let classes = el.className.split(" ");
    if (el.className.indexOf(toAdd) === -1) {
      classes.push(toAdd);
    }
    if (toRemove) {
      classes = classes.filter((clas) => {
        return (clas != toRemove)
      })
    }
    classes = classes.join(" ");
    el.className = classes;
  },
  uploadPic: (image, callback) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "vinkrins");
    Util.postMethod("	https://api.cloudinary.com/v1_1/vinkrins/image/upload", data, {})
    .then(res => res.json())
    .then(response => {
      callback(response);
    }).catch(e => {
      console.log(e);
    })
  }

}

export default Util;