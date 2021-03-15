import React from "react"
import Axios from "axios"
import swal from 'sweetalert'

import linkAPIProduct from "../Supports/Constants/linkAPIProduct"

class LandingPage extends React.Component  {
    state = {
        dataProduct: null
    }

    getDataProduct = () => {
        Axios.get (linkAPIProduct)

        .then ((res) => {
            // console.log (res.data)
            this.setState ({dataProduct: res.data})
        })

        .catch ((err) => {
            console.log (err)
        })
    }

    goToAddProduct = (id) => {

        if (localStorage.getItem ("id") === null) {

            swal({
                title: "Error",
                text: "You have to log in or register first",
                icon: "error",
              })
        
        } else {
            window.location = (`/add-to-cart/${id}`)
        }
    }

    mapDataProduct = () => {
        return this.state.dataProduct.map ((el, i) => {
            return (
                <div key={i}>
                    <div className="card m-3" style={{width: "18rem"}}>
                        <img src={el.img} className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title">{el.name}</h5>
                            <div className="card-text">
                                <p>
                                    Stock : {el.stock} item(s)
                                </p>
                                <p>
                                    Rp. {el.price}
                                </p>
                            </div>
                            <input type="button" className="btn btn-primary" value="Add To Cart" onClick={() => this.goToAddProduct(el.id)}/>
                        </div>
                    </div>
                </div>
            )
        })
    }

    componentDidMount () {
        this.getDataProduct ()
    }
    render () {
        if (this.state.dataProduct === null) {
            return (
                <div className="container">
                    <div className="row">
                        <h1>
                            Products
                        </h1>
                    </div>

                    <div className="row">
                        Now Loading
                    </div>
                </div>
            )
        }

        return (
            <div className="container">
                <div className="row">
                    <h1>
                        Products
                    </h1>
                </div>

                <div className="row flex-wrap">
                    {
                        this.mapDataProduct ()
                    }
                </div>
            </div>
        )
    }
}

export default LandingPage
