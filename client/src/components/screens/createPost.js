import React, {useState, useEffect} from 'react';
import M from 'materialize-css';
import {useHistory} from 'react-router-dom';
import * as Util from '../../shared/Utils';
import {ACCESS_TOKEN, CLOUDINARY_UPLOAD_URL} from "../../shared/AppConstants";
import axiosInstance, {axiosOnly} from "../../services/axios";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const history = useHistory();
    useEffect(() => {

        if (!url) {
            return;
        }
        const postData = JSON.stringify({
            title,
            body,
            pic: url
        });

        axiosInstance.post("/createPost", postData)
            .then((res) => {
                if (res?.data?.error)
                    M.toast({html: res?.data?.error, classes: "#ef5350 red lighten-1"});
                else {
                    M.toast({html: "Created Post Successfully", classes: "#a5d6a7 green lighten-2"});
                    history.push("/");
                }
            })
            .catch(er => {
                M.toast({html: "Some error occurred, please try again", classes: "#ef5350 red lighten-1"});
                console.log(er);
            })
    }, [url, body, history, title]);

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "vinkrins");
        data.append("title", title);
        data.append("description", body);

        axiosOnly.post(CLOUDINARY_UPLOAD_URL, data, {})
            .then(response => {
                setUrl(response?.data?.url);
            }).catch(e => {
            console.log(e);
        })
    }
    return (<div className="card ">
        <div className="row">
            <div className="col s6 push-s3">
                <h4>Create Post</h4>

                <div className="row">
                    <div className="input-field col s12">
                        <input id="title" type="text" className="validate"
                               required
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                        />
                        <label htmlFor="title">Title</label>
                    </div>
                    <div className="input-field col s12">
                        <input id="body" type="text" className="validate" required
                               value={body}
                               onChange={(e) => setBody(e.target.value)}
                        />
                        <label htmlFor="body">Body</label>
                    </div>
                    <div className="file-field input-field col s12">
                        <div className="btn">
                            <span>File</span>
                            <input type="file"
                                   onChange={(e) => setImage(e.target.files[0])}
                            />
                            <input type="hidden" value={url}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
                        </div>
                    </div>
                    <div className="input-field col s12">
                        <button className="btn waves-effect waves-light" type="submit" name="action"
                                onClick={() => postDetails()}>Post
                            <i className="material-icons right">send</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default CreatePost;