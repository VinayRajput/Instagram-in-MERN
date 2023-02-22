import React, {useState, useEffect, useCallback} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
import Util from '../../Utils';

const Signup = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [userPicUrl, setUserPicUrl] = useState("");
    const history = useHistory();
    const signup = async () => {
        let msg = Util.validateEmail(email)
        if (msg)
            return M.toast({html: msg, classes: "#ef5350 red lighten-1"});

        if (!!image && !userPicUrl) {
            Util.uploadPic(image, (response) => {
                setUserPicUrl(response.url);
                //submitForm(response.url);
            })
        } else {
            submitForm()
        }
    }
    const submitForm = useCallback((url) => {
        const data = JSON.stringify({
            name: name,
            email: email,
            password: password,
            userPic: url || userPicUrl
        });

        Util.postMethod("/signup", data)
            .then(res => res.json())
            .then((data) => {
                if (data.error)
                    M.toast({html: data.error, classes: "#ef5350 red lighten-1"});
                else {
                    M.toast({html: data.message, classes: "#a5d6a7 green lighten-3"});
                    history.push("/login")
                }
            })
    }, [email, history, name, password, userPicUrl])

    useEffect(() => {
        if (!!userPicUrl) {
            submitForm();
        }

    }, [userPicUrl, submitForm]);

    return (
        <div className="card signup">
            <div className="row">
                <div className="col s6 push-s3 center-align">

                    <h1 className="ttl">Instagram</h1>
                    <form className="col s12">
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="name" type="text" className="validate"
                                       value={name} required
                                       onChange={(e) => setName(e.target.value)}/>
                                <label htmlFor="name">Full Name</label>
                            </div>
                            <div className="input-field col s12">
                                <input id="email" type="email" className="validate"
                                       value={email} required
                                       onChange={(e) => setEmail(e.target.value)}/>
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="file-field input-field col s12">
                                <div className="btn">
                                    <span>Upload User pic</span>
                                    <input type="file"
                                           onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text"/>
                                </div>
                            </div>
                            <div className="input-field col s12">
                                <input id="password" type="password" className="validate"
                                       value={password} required
                                       onChange={(e) => setPassword(e.target.value)}/>
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="input-field col s12">
                                <button className="btn waves-effect waves-light" type="button" name="action"
                                        onClick={signup}>Signup
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                            <div className="input-field col s12">
                                Already have an account?, <Link to="/login">SignIn here!</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>)
}

export default Signup;