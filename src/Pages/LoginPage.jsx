import React from "react"
import Axios from "axios"

import emailValidation from "../Supports/Functions/emailValidation"
import passwordValidation from "../Supports/Functions/passValidation"

import linkAPIUser from "../Supports/Constants/linkAPIUser"

class LoginPage extends React.Component {

    state = {
        emailData: null,
        emailValid: false,

        passwordData:null,
        passwordValid: false
    }

    checkEmail = () => {
        let emailUser = this.refs.inputEmail.value
        let emailValidationRes = emailValidation (emailUser)

        if (emailValidationRes === true) {
            this.setState ({emailData: emailUser})
            // this.setState ({emailValid: true})

            Axios.get (linkAPIUser + `?email=${emailUser}`)

            .then ((res) => {
                // console.log (res.status)
                if (res.data.length === 0) {
                    this.setState ({emailValid: true})
                } 
                else {
                    this.setState ({emailValid: false})
                }
            })

            .catch ((err) => {
                console.log (err)
            })
        }

    }

    checkPassword = () => {
        let passUser = this.refs.inputPassword.value
        let passValidationRes = passwordValidation (passUser)

        if (passValidationRes === true) {
            this.setState ({passwordData: passUser})
            // this.setState ({passwordValid: true})

            Axios.get (linkAPIUser + `?password=${passUser}`)

            .then ((res) => {
                // console.log (res.status)
                if (res.data.length === 0) {
                    this.setState ({passwordValid: true})
                } 
                else {
                    this.setState ({passwordValid: false})
                }
            })

            .catch ((err) => {
                console.log (err)
            })
        }
    }

    getLogin = () => {
        // this.checkEmail ()
        // this.checkPassword ()

        let emailUser = this.state.emailData
        let passwordUser = this.state.passwordData

        if (this.state.emailValid === true && this.state.passwordValid === true) {    

            let dataToSend = {
                email: emailUser,
                password: passwordUser
            }

            Axios.post (linkAPIUser, dataToSend) 

            .then ((res) => {
                localStorage.setItem ("id", res.data.id)
                localStorage.setItem ("email", emailUser)

                window.location = "/"
            })

            .catch ((err => {
                console.log (err)
            }))

        } else {

            Axios.get (linkAPIUser +`?email=${emailUser}`)

            .then ((res)=> {
                localStorage.setItem ("id", res.data[0].id)
                localStorage.setItem ("email", emailUser)

                window.location = "/"
            })

            .catch ((err) => {
                console.log (err)
            })
        }
    }


    render () {
        return (
            <div className="container mt-3 d-flex justify-content-center">
                <div className="col-6 shadow mt-2">
                    <div className="col-12">
                        <h5>
                            Login
                        </h5>
                    </div>
                    <div className="col-12 mt-3">
                        <label htmlFor="inputEmail">Email</label>
                        <input type="text" className="form-control" ref="inputEmail" onChange={this.checkEmail}/>
                        {/* <input type="text" className="form-control" ref="inputEmail"/> */}
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputPassword">Password</label>
                        <input type="password" className="form-control" ref="inputPassword" onChange={this.checkPassword}/>
                        {/* <input type="password" className="form-control" ref="inputPassword"/> */}
                    </div>
                    <div className="col-3 my-3">
                        <input type="button" className="btn btn-primary" value="Login" onClick={this.getLogin}/>
                    </div>
                </div>
            </div>
        )
    }

}

export default LoginPage