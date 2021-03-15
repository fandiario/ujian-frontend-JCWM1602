import React from "react"
import Axios from "axios"

import linkAPITransaction from "../Supports/Constants/linkAPITransaction"
import linkAPIProduct from "../Supports/Constants/linkAPIProduct"

class HistoryTransaction extends React.Component {

    state = {
        dataTransactions: null,
        dataProducts: null
    }

    getDataTransaction = () => {
        let idUser = localStorage.getItem ("id")
        Axios.get (linkAPITransaction+`/?idUser=${idUser}`)

        .then ((res) => {
            this.setState ({dataTransactions: res.data})
            this.getDataProduct ()
        })

        .catch ((err) => {
            console.log (err)
        })
    }

    getDataProduct = () => {
        let arr = []

        for (let i = 0; i < (this.state.dataTransactions).length; i++) {
            for (let j = 0; j < (this.state.dataTransactions[i].detail).length; j++){
                
                Axios.get (linkAPIProduct +`/${this.state.dataTransactions[i].detail[j].productId}`)

                .then ((res)=> {
                    arr.push (res.data)
                    this.setState ({dataProducts: arr})
                })

                .catch ((err) => {
                    console.log (err)
                })
            } 
        }
    }

    mapDataTransaction = () => {
        return this.state.dataTransactions.map ((el, i) => {
            return (
                <div key = {i}>
                    <div className="row shadow flex-column">
                        <div className="col-3">
                            <div>
                                id Transaction : {el.id}
                            </div>
                            <div>
                                email : {el.userEmail}
                            </div>
                            <div>
                                Status: {el.status}
                            </div>
                        </div>

                        <div className="col-7 my-2">
                            {
                                el.detail.map((val, j) => {
                                    return (
                                        <div key = {j}>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="mr-4">
                                                        {j + 1}
                                                    </div>
                                                    <div className="mr-4">
                                                        <h5>
                                                            {val.productName}
                                                        </h5>
                                                    </div>
                                                    <div className="mr-4">
                                                        {val.productQuantity} item(s)
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    )
                                
                                })
                            }
                        </div>
                        
                        <div className="row">
                            <div className="col-8">
                                <h5 className="ml-3">
                                    Total : RP. {el.total}
                                </h5>
                            </div>
                            
                            <div className="col-4">
                                <input type="button" value="Pay Now" className=" btn btn-primary mr-2" onClick={() => this.paymentTransaction (el.id)}/>
                                <input type="button" value="Cancel Transaction" className=" btn btn-warning" onClick={() => this.cancelTransaction (el.id)}/>
                            </div>
                            
                        </div>
        
                    </div>
                </div>
            )
        })
    }

    cancelTransaction=(index)=>{
        Axios.patch (linkAPITransaction +`/${index}`, {status: "batal"})

        .then ((res) => {
            this.getDataTransaction ()
        })

        .catch ((err) => {
            console.log (err)
        })
    }

    paymentTransaction=(index)=> {
        Axios.patch (linkAPITransaction +`/${index}`, {status: "sudah dibayar"})

        .then ((res) => {
            this.patchStockProduct ()
        })

        .catch ((err) => {
            console.log (err)
        })
    }

    patchStockProduct = () => {
        for (let i = 0; i < (this.state.dataTransactions).length; i++) {
            for (let j = 0; j < (this.state.dataTransactions[i].detail).length; j++){
                
                let stockProduct = this.state.dataProducts[j].stock
                let quantityTransaction =  this.state.dataTransactions[i].detail[j].productQuantity
                let newStock = stockProduct - quantityTransaction

                Axios.patch (linkAPIProduct +`/${this.state.dataTransactions[i].detail[j].productId}`, {stock: newStock})

                .then ((res)=> {
                    this.getDataTransaction ()
                })

                .catch ((err) => {
                    console.log (err)
                })
            } 
        }
    }

    componentDidMount () {
        this.getDataTransaction ()
    }
    render () {
        if (this.state.dataTransactions === null) {
            return (
                <div className="container">
                    <div className="row">
                        <h1>
                            History Transaction
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
                            History Transaction
                        </h1>
                    </div>

                    <div className="row flex-column ">
                        {this.mapDataTransaction()}
                    </div>
                </div>
            )   
        }
        
    }
}

export default HistoryTransaction
