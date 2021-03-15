import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"

// Component
import Navbar from "./Components/Navbar"

// Page
import LandingPage from "./Pages/LandingPage"
import LoginPage from "./Pages/LoginPage"
import AddToCart from "./Pages/AddToCartPage"
import Cart from "./Pages/CartPage"
import HistoryTransaction from "./Pages/HistoryTransactionPage"

class App extends React.Component {
  render () {
    return (
      <>
        <Router>
          <Navbar></Navbar>

          <Switch>

            <Route exact path="/" component={LandingPage}></Route>

            {/* {
                localStorage.getItem ("id") ?
                <>
                  <Redirect to = "/">
                    <Route path="/login" component={LoginPage}></Route>
                  </Redirect>

                  <Route path="/add-to-cart/:idProduct" component={AddToCart}></Route>

                  <Route path="/cart/:idUser" component={Cart}></Route>

                  <Route path="/history-transaction/:idUser" component={HistoryTransaction}></Route>
                </>
              :
                <>
                  <Route path="/login" component={LoginPage}></Route>

                  <Redirect to ="/">
                    <Route path="/add-to-cart/:idProduct" component={AddToCart}></Route>
                  </Redirect>

                  <Redirect to ="/">
                    <Route path="/cart/:idUser" component={Cart}></Route>
                  </Redirect>

                  <Redirect to ="/">
                  <Route path="/history-transaction/:idUser" component={HistoryTransaction}></Route>
                  </Redirect>

                </>
              
            } */}

            <Route path="/add-to-cart/:idProduct" component={AddToCart}></Route> 
            <Route path="/cart/:idUser" component={Cart}></Route>   
            <Route path="/history-transaction/:idUser" component={HistoryTransaction}></Route>

            {/* {
              localStorage.getItem ("id") ?
                <Route path="/add-to-cart/:idProduct" component={AddToCart}></Route>
              :
                <Redirect to = {{pathname: "/"}}></Redirect>
            }

            {
              localStorage.getItem ("id") ?
                <Route path="/cart/:idUser" component={Cart}></Route>
              :
                <Redirect to = {{pathname: "/"}}></Redirect>
            }

            {
              localStorage.getItem ("id") ?
                <Route path="/history-transaction/:idUser" component={HistoryTransaction}></Route>
              :
                <Redirect to = {{pathname: "/"}}></Redirect>
            } */}

            {
              localStorage.getItem ("id") ?
                <Redirect to = {{pathname: "/"}}></Redirect>
              :
                <Route path="/login" component={LoginPage}></Route>
            } 
            

          </Switch>

        </Router>
      </>
    )
  }
}

export default App;
