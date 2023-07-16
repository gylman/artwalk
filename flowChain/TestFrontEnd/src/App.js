
import './App.css';
import * as fcl from "@onflow/fcl"
import {config} from "@onflow/fcl"
import { useState, useEffect } from "react"
import { MINT_ARTWALK } from "./mint.tx"

config({
    "accessNode.api": "https://rest-testnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    "discovery.wallet.method": "POP/RPC", // Optional. Available methods are "IFRAME/RPC", "POP/RPC", "TAB/RPC" or "HTTP/POST", defaults to "IFRAME/RPC".
    "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/testnet/authn",
    "app.detail.title": "ArtWalk"
})

function App() {
  
    const [user, setUser] = useState({loggedIn: null})
    const [name, setName] = useState('')
    const [transactionStatus, setTransactionStatus] = useState(null)
    let supply = -1;
  
    useEffect(() => fcl.currentUser.subscribe(setUser), [])
  
    const sendQuery = async () => {
      const res = await fcl.query({
        cadence: `
        import ArtWalk from 0xa963b619092736ed
        
        pub fun main(): UInt64 {
        
          let totalSupply = ArtWalk.totalSupply
           
          return totalSupply
        }
      `
      })
      supply = res
      console.log(res)
      setName('No Profile')
    }

    const executeTransaction = async () => {
      const transactionId = await fcl.mutate({
        cadence: MINT_ARTWALK,
        args: (arg, t) => [arg("image", t.String),arg("Square", t.String)],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 50
      })
    
      const tx = await fcl.tx(transactionId).subscribe(res => setTransactionStatus(res.status))
      console.log(await tx)
    }

    const AuthedState = () => {
      return (
        <div>
          <div>Address: {user?.addr ?? "No Address"}</div>
          <div>Profile Name: {name ?? "--"}</div>
          <div>Supply: {supply}</div>
          <div>Transaction Status: {transactionStatus ?? "--"}</div> 
          <button onClick={sendQuery}>Send Query</button>
          <button onClick={fcl.unauthenticate}>Log Out</button>
          <button onClick={executeTransaction}>Mint</button>
        </div>
      )
    }
  
    const UnauthenticatedState = () => {
      return (
        <div>
          <button onClick={fcl.logIn}>Log In</button>
          <button onClick={fcl.signUp}>Sign Up</button>
        </div>
      )
    }
  
    return (
      <div>
        <h1>Flow App</h1>
        {user.loggedIn
          ? <AuthedState />
          : <UnauthenticatedState />
        }
      </div>
    )
  }



export default App;
