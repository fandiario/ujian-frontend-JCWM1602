import React from "react"
import Axios from "axios"
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
// import swal from "sweetalert"

import linkAPIProduct from "../Supports/Constants/linkAPIProduct"
import linkApiCart from "../Supports/Constants/linkAPICart"

class AddToCart extends React.Component {
    state = {
        dataProduct: null,
        quantityToCart: 1,
        toastNotif: false,
        idCart: null
    }

    getDataProduct = () => {
        let idProduct = this.props.location.pathname.split("/")[2]

        Axios.get (linkAPIProduct + `/${idProduct}`)

        .then ((res) => {
            this.setState ({dataProduct: res.data})
        })

        .catch ((err) => {
            console.log (err)
        })
    }

    plusQuantity = () => {
        let quantityNow = this.state.quantityToCart
        let stockNow = this.state.dataProduct.stock

        let quantityNew = quantityNow + 1

        if (quantityNew > stockNow) {
            alert ("Order Quantity is over than Product's Stock")

        } else {

            this.setState ({quantityToCart: quantityNew})
        }

        
    }

    minusQuantity = () => {
        let quantityNow = this.state.quantityToCart

        let quantityNew = quantityNow - 1

        if (quantityNew <= 0) {
            alert ("Minimum order is 1")
        }

        this.setState ({quantityToCart: quantityNew})
    }   

    // toastNotify = () => {
    //     return (
    //         <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
    //             <div className="toast-header">
    //                 <img src="..." className="rounded mr-2" alt="..."/>
    //                 <strong className="mr-auto">Notification</strong>
    //                 <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
    //                 <span aria-hidden="true">&times;</span>
    //                 </button>
    //             </div>
    //             <div className="toast-body">
    //                 Successfully added to your Cart.
    //             </div>
    //         </div>
    //     )
    // }

    addToCart = () => {
        let userId = localStorage.getItem ("id")
        let productId  = this.props.location.pathname.split("/")[2]
        let quantityToCart = this.state.quantityToCart
        let priceProduct = this.state.dataProduct.price

        Axios.get (linkApiCart +`?idProduct=${productId}`)
        .then ((res) => {
            if (res.data.length === 0) {

                Axios.post (linkApiCart, {idUser: userId, idProduct: productId, quantity: quantityToCart, price: priceProduct})

                .then ((res) => {
                    this.setState ({toastNotif: true})
                    this.setState ({idCart: res.data[0].id})
                    // window.location = "/"
                    window.location = `/cart/${userId}`
                })
                    

                .catch ((err) => {
                    console.log (err)
                })

            } else {
                let cartId = this.state.idCart
                let userId = localStorage.getItem ("id")
                Axios.patch (linkApiCart + `/${cartId}`, {quantity: quantityToCart})

                .then ((res) => {
                    window.location = `/cart/${userId}`
                })

                .catch ((err) => {
                    console.log (err)
                })
            }
        })

        .catch ((err) => {
            console.log (err)
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
                            Add To cart
                        </h1>
                    </div>

                    <div className="row">
                        Loading
                    </div>

                </div>
            )
            

        } else {
            return (
                <div className="container">
                    <div className="row">
                        <h1>
                            Add To cart
                        </h1>
                    </div>
    
                    <div className="row shadow">
                        <div className="col-6">
                            <img src={this.state.dataProduct.img} className="img-fluid" style={{width: "auto", height: "250px"}} alt=""/>
                        </div>

                        <div className="col-6">
                            <div className="mt-3">
                                <h5>
                                    {this.state.dataProduct.name}
                                </h5>
                            </div>
                               
                            <div>
                                <p>
                                    Stock : {this.state.dataProduct.stock} item(s)
                                </p>

                                <p>
                                    Desc : {this.state.dataProduct.description}
                                </p>

                                <p>
                                    Rp : {this.state.dataProduct.price}
                                </p>

                                <p>
                                    Add To cart :
                                </p>

                                <p>
                                    <span> 
                                        <input type="button" className="btn btn-danger" value="-" onClick={this.minusQuantity}/> 
                                    </span>

                                    <span className="mx-3">
                                        {this.state.quantityToCart}
                                    </span>

                                    <span> 
                                        <input type="button" className="btn btn-primary" value="+" onClick={this.plusQuantity}/> 
                                    </span>
                                </p>

                                <p className="my-5">
                                    <input type="button" className="btn btn-primary" value="Add To Cart" style={{width: "300px"}} onClick={this.addToCart}/>
                                </p>
                            </div>

                            <div className="my-2">
                                {   
                                    this.state.toastNotif === true ?
                                    <div className="p-3 my-2 rounded">
                                        <Toast>
                                            <ToastHeader>
                                                Notification
                                            </ToastHeader>
                                            <ToastBody>
                                                Successfully added to cart!
                                            </ToastBody>
                                        </Toast>
                                    </div>
                                    :
                                        null
                                }
                            </div>

                        </div>
                    </div>
    
                </div>
            )
        }
    }

}
export default AddToCart