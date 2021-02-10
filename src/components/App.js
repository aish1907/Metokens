import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Token from '../abis/Token.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = Token.networks[networkId]
    if(networkData) {
      const abi = Token.abi
      const address = networkData.address
      console.log(address);
      const contract = await web3.eth.Contract(abi, address)
      this.setState({ contract })
      const coar = await contract.methods.arr().call()
      if(coar){const totalSupply = coar.length;
        this.setState({ totalSupply })
      // Load Colors
      for (var i = 1; i <= totalSupply; i++) {
        const plac = coar[i - 1]
        this.setState({
          placs: [...this.state.placs, plac]
        })}
        //console.log(plac);
      }
      console.log(this.state.placs);
      const memeHash = await contract.methods.get().call()
      this.setState({ memeHash })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = (naam,symbol,amnt) => {
    if(this.state.contract){
      this.setState({ naam });
      this.setState({ symbol });
      this.setState({ amnt });
    this.state.contract.methods.mint(naam,symbol,amnt).send({ from: this.state.account })
    .once('receipt', (receipt) => {
     console.log(receipt)
    })
    }
  }

  getadd = (plac) => {
    const addr = this.state.contract.methods.retadd(plac).call();
    return addr;
  }

  send = (plac,address) => {
    if(this.state.contract){
    this.state.contract.methods._send(plac,address).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        placs: [...this.state.placs, plac]
      })
    })}
  }

  callb = (plac) => {
    //const add = this.getadd(plac);
    if(this.state.contract){
      this.state.contract.methods.callb(plac).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({
          placs: [...this.state.placs, plac]
        })

      })
    }
  }

  arrange = (plac) =>{
    if(this.state.contract){
      this.state.contract.methods.callb(plac).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({
          placs: [...this.state.placs, plac]
        })

      })
    }
  }

  balof = () =>{
    if(this.state.contract){
      this.state.balance = this.state.contract.methods.balanceOf(this.state.account)
    }
  }
  

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      naam: '',
      sybol: '',
      amnt: 0,
      placs: [],
      memeHash: '',
      web3: null,
      balance: 0,
      buffer: null
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
       this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
         return this.setState({ memeHash: result[0].hash })
       })
    })
  }

  render() {
    return (
      <div>
        
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            MediTokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Tokens</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const name = this.name.value
                  const symbol = this.symbol.value
                  const amount = this.amount.value
                  this.mint(name,symbol,amount)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Name'
                    ref={(input) => { this.name = input }}
                  />
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Symbol'
                    ref={(input) => { this.symbol = input }}
                  />
                  <input
                    type='number'
                    className='form-control mb-1'
                    placeholder='Amount'
                    ref={(input) => { this.amount = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>

              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const place = this.place.value
                  const ad = this.ad.value
                  this.send(place,ad)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='Place'
                    ref={(input) => { this.place = input }}
                  />
                  <input
                    type='address'
                    className='form-control mb-1'
                    placeholder='Address'
                    ref={(input) => { this.ad = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='ISSUE'
                  />
                </form>
              </div>

            </main>
          </div>
          <hr/>
          <div className="row text-center">
          {
           this.state.placs.length > 0 &&  this.state.placs.map((plac, key) => {
            return(
              <div key={key} className="col-md-3 mb-3">
                <div className="token" style={{ backgroundColor: '#80800' }}></div>
                <div>{plac}</div>
                <div>
                {plac.length>0 ?  <div><form onSubmit={(event) => {
                      event.preventDefault()
                      this.callb(plac)
                      }}>
                    
                        <input
                        type='submit'
                        className='btn btn-block btn-danger'
                        value='CALLB'
                        />
                      </form></div> : <div> </div>}
          
                </div>
              </div>
            )
                  })
            }
          </div>
          <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  { this.state.balance > 0 ? <div> <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} /></div> : <div><h6> No Report</h6></div>}
                 
                </a>
                <p>&nbsp;</p>
                <h2>Change Report</h2>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' />
                </form>
              </div>
            </main>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default App;