import React from "react"
import Axios from "axios"
import {Link} from "react-router-dom"

import linkAPICart from "../Supports/Constants/linkAPICart"

class Navbar extends React.Component {
    state= {
        idUser: null,
        emailData : null,
        totalItemCart: null
    }

    getEmailUser=()=> {
        let idUser = localStorage.getItem ("id")
        let emailUser = localStorage.getItem ("email")

        this.setState ({idUser: idUser})

        if (emailUser) {
            this.setState ({emailData: emailUser})
        }
    }

    logOut = () => {
        localStorage.removeItem ("id")
        localStorage.removeItem ("email")

        window.location = "/"
    }

    getDataCart = () => {
        let idUser = localStorage.getItem ("id")

        Axios.get (linkAPICart + `?idUser=${idUser}`)

        .then ((res) => {
            this.setState ({totalItemCart: res.data.length})
        })

        .catch ((err)=> {

        })
    }

    componentDidMount () {
        this.getEmailUser ()
    }

    componentDidUpdate () {
        this.getDataCart ()
    }
    render () {
        return (
            <div className="bg-dark">
                <div className="container text-light">
                    <div className="row justify-content-between py-2">
                        <div>
                            <Link to="/" style={{color:"inherit", textDecoration:"none"}}>
                                TokoSepatu
                            </Link>
                            
                        </div>

                        <div>
                            <span>
                                {
                                    this.state.emailData ?
                                        <> 
                                            <span>
                                                {this.state.emailData}
                                            </span>
                                            <span onClick={this.logOut} style={{cursor:"pointer"}}>
                                                / Logout ?
                                            </span>
                                        </>
                                        
                                    :
                                    <Link to="/login" style={{color:"inherit", textDecoration:"none"}}>
                                        Login User
                                    </Link>
                                }
                                
                            </span>
                            <span className="mx-2">
                                <Link to={`/history-transaction/${this.state.idUser}`} style={{color:"inherit", textDecoration:"none"}}>
                                    History Transaction
                                </Link>
                            </span>
                            <span>
                                {}
                                <Link to={`/cart/${this.state.idUser}`} style={{color:"inherit", textDecoration:"none"}}>
                                    Cart
                                </Link>
                            </span>
                            <span className="badge badge-light ml-2">
                                {
                                    this.state.totalItemCart ?
                                        this.state.totalItemCart
                                    :
                                        null
                                }   
                            </span>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Navbar