import React from "react"
import Axios from "axios"
import swal from "sweetalert"

import linkAPICart from "../Supports/Constants/linkAPICart"
import linkAPIProduct from "../Supports/Constants/linkAPIProduct"
import linkAPITransaction from "../Supports/Constants/linkAPITransaction"

class Cart extends React.Component {
    state={
        dataCart: null,
        dataProducts: null,
        totalPriceCart: 0
    }

    getDataCart = () => {
        let userId = localStorage.getItem ("id")
        Axios.get (linkAPICart + `?idUser=${userId}`)
        
        .then ((res) => {
            this.setState ({dataCart: res.data})
            this.getDataProduct ()
        })

        .catch ((err) => {
            console.log (err)
        })
    }

    getDataProduct = () => {
        let arr = []

        for (let i = 0; i < (this.state.dataCart).length; i++) {

            Axios.get (linkAPIProduct + `/${this.state.dataCart[i].idProduct}`)

            .then ((res) => {
                arr.push (res.data)
                this.setState ({dataProducts: arr})

                this.calculateTotal ()
            })

            .catch ((err) => {
                console.log (err)
            })
        }
    }

    mapDataCart = () => {
        // console.log (this.state.dataProducts)
        return this.state.dataProducts.map ((el, i) => {
            return (
                <div key={i}>
                    
                    <div className="row shadow mb-5">
                        <div className="col-4">
                            <img src={el.img} className="img-fluid" style={{width: "auto", height: "150px"}} alt=""/>
                        </div>
                        <div className="col-6">
                            <h5>
                                {el.name}
                            </h5>
                            <p>
                                Price per Unit: Rp. {el.price}
                            </p>
                            <div>
                                <span> 
                                    <input type="button" className="btn btn-danger" value="-" onClick={ () => this.minusQuantity (i)}/> 
                                </span>

                                <span className="mx-3">
                                    {this.state.dataCart[i].quantity}
                                </span>
                                
                                <span> 
                                    <input type="button" className="btn btn-primary" value="+" onClick={ () => this.plusQuantity (i)}/> 
                                </span>
                            </div>
                        </div>
                        <div className="col-2">
                            <span>
                                <input type="button" className="btn btn-warning" value="Remove ?" onClick={ () => this.removeFromCart (i)}/>
                            </span>
                        </div>
                    </div>
                    
                    
                </div>
            )
        })
    }

    plusQuantity= (index) => {
        let cartId = this.state.dataCart[index].id
        let productStock = this.state.dataProducts[index.stock]
        let quantityNow = this.state.dataCart[index.quantity]
        let quantityNew = quantityNow + 1

        if (quantityNew > productStock) {
            swal ({
                title: "Error",
                text: "Order Quantity is over than Product's Stock",
                icon: "error",
            })

        } else {
            Axios.patch (linkAPICart + `/${cartId}`, ({quantity: quantityNew}))

            .then ((res) => {
                this.getDataCart ()
            })

            .catch ((err) => {
                console.log (err)
            })
        }

        
    }

    minusQuantity = (index) => {
        let cartId = this.state.dataCart[index].id
        let quantityNow = this.state.dataCart[index.quantity]
        let quantityNew = quantityNow - 1

        if (quantityNew < 1) {
            swal ({
                title: "Error",
                text: "Minimum order is 1",
                icon: "error",
            })
        } else {

            Axios.patch (linkAPICart + `/${cartId}`, ({quantity: quantityNew}))

            .then ((res) => {
                this.getDataCart ()
            })

            .catch ((err) => {
                console.log (err)
            })

        }

        
    }

    removeFromCart = (index) => {
        let cartId = this.state.dataCart[index].id

        Axios.delete (linkAPICart + `/${cartId}`)

        .then ((res) => {
            // this.getDataCart ()
            window.location=`${this.props.location.pathname}`
        })

        .catch ((err) => {

        })
    }

    calculateTotal = () => {
        let arrSubtotals = []
        let arrQuantities = []
        let arrPricePerUnits = []

        let subtotal = 0
        let result = 0

        for (let i = 0; i < (this.state.dataProducts).length; i++) {
            let dataPrice = this.state.dataProducts[i].price

            arrPricePerUnits.push (dataPrice)
        }

        for (let j = 0; j < (this.state.dataCart).length; j++) {
            let dataQuantity = this.state.dataCart[j].quantity

            arrQuantities.push (dataQuantity)
        }

        for (let k = 0; k < arrQuantities.length; k++) {
            subtotal = arrQuantities[k] * arrPricePerUnits[k]

            arrSubtotals.push (subtotal)
        }

        for (let l = 0; l < arrSubtotals.length; l++) {
            result += arrSubtotals[l]
        }

        this.setState ({totalPriceCart: result})
    }

    checkOutTransaction = () => {
        let userId = localStorage.getItem ("id")
        let emailUser = localStorage.getItem ("email")

        let totalPrice = this.state.totalPriceCart

        let detailItems = this.state.dataCart.map ((el, i) => {
            return {
                productId: this.state.dataProducts[i].id,
                productName: this.state.dataProducts[i].name,
                productPrice: el.price,
                productQuantity: el.quantity,
                productImage: this.state.dataProducts[i].img
            }
        })

        let dataToSend = {
            idUser: userId,
            userEmail: emailUser,
            status: "belum bayar",
            total: totalPrice,
            detail: detailItems
        }

        swal ({
            title: "Are you sure you want to check out ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })

        .then ((confirmation) => {
            if (confirmation) {
                Axios.post (linkAPITransaction, dataToSend) 

                .then ((res) => {
                    this.deleteCart ()
                })

                .catch ((err)=> {
                    console.log (err)
                })
                
            } else {
                swal({
                    text: "Your transaction has been canceled",
                })
            }
        })

    }

    deleteCart = () => {
        this.state.dataCart.forEach ((el, i) => {
            Axios.delete (linkAPICart + `/${el.id}`)

            .then ((res) => {
                let idUser = localStorage.getItem ("id")
                window.location=`/history-transaction/${idUser}`
            })

            .catch ((err) => {
                console.log (err)
            })
        })
    }

    componentDidMount () {
        this.getDataCart ()
    }
    render () {

        if (this.state.dataCart === null || this.state.dataProducts === null) {
            return (
                <div className="container">
                    <div className="row">
                        <h1>
                            Your Cart
                        </h1>
                    </div>

                    <div className="row">
                        <div className="col-7">
                            Your Cart is Empty
                        </div>
                    </div>
                </div>
            )
        
        } else {
            return (
                <div className="container">
                    <div className="row">
                        <h1>
                            Your Cart
                        </h1>
                    </div>
    
                    <div className="row">
                        <div className="col-8">
                            {
                                this.mapDataCart ()
                            }
                        </div>

                        <div className="col-4">
                            <input type="button" className="btn btn-primary" value="Check Out" style={{width: "150px"}} onClick={this.checkOutTransaction}/>
                        </div>
                    </div>
                </div>
            )
        }

        
    }
} 

export default Cart
