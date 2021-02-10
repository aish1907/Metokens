import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Token from './abis/Token.json'
import Map from './Map'


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
      // Load Places
      for (var i = 1; i <= totalSupply; i++) {
        const plac = coar[i - 1]
        this.setState({
          placs: [...this.state.placs, plac]
        })}
        //console.log(plac);

      }
      const balance = await contract.methods.balanceOf(accounts[0]).call()
      console.log(balance + "balance")
      this.setState({balance})
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
       
        <div id="wrapper">

        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

<a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
    <div className="sidebar-brand-icon rotate-n-15">
        <i className="fa fa-laugh-wink"></i>
    </div>
    <div className="sidebar-brand-text mx-3">MeTokens<sup>2</sup></div>
</a>

<hr className="sidebar-divider my-0" />

<li className="nav-item active">
    <a className="nav-link" href="index.html">
        <i className="fa fa-fw fa-tachometer-alt"></i>
        <span>Dashboard</span></a>
</li>

<hr className="sidebar-divider"/>

<div className="sidebar-heading">
    Interface
</div>

<li className="nav-item">
    <a className="nav-link collapsed" href="#nop" data-toggle="collapse" data-target="#collapseTwo"
        aria-expanded="true" aria-controls="collapseTwo">
        <i className="fa fa-fw fa-cog"></i>
        <span>Components</span>
    </a>
    
</li>

<li className="nav-item">
    <a className="nav-link collapsed" href="#nop" data-toggle="collapse" data-target="#collapseUtilities"
        aria-expanded="true" aria-controls="collapseUtilities">
        <i className="fa fa-fw fa-wrench"></i>
        <span>Utilities</span>
    </a>
    
</li>

<hr className="sidebar-divider"/>

<div className="sidebar-heading">
    Addons
</div>



<li className="nav-item">
    <a className="nav-link" href="#blu">
        <i className="fa fa-fw fa-signal"></i>
        <span>Charts</span></a>
</li>

<li className="nav-item">
    <a className="nav-link" href="#boo">
        <i className="fa fa-fw fa-table"></i>
        <span>Tables</span></a>
</li>

<hr className="sidebar-divider d-none d-md-block"/>

<div className="text-center d-none d-md-inline">
    <button className="rounded-circle border-0" id="sidebarToggle"></button>
</div>

<div className="sidebar-card">
    <img className="sidebar-card-illustration mb-2" src="img/undraw_rocket.svg" alt="" />
    <p className="text-center mb-2"><strong>METoken</strong> is packed with premium features, components, and more!</p>
    <a className="btn btn-success btn-sm" href="#">We are improving soon!</a>
</div>

</ul>

<div id="content-wrapper" className="d-flex flex-column">

              <div id="content">

                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                        <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                            <i className="fa fa-bars"></i>
                        </button>
                 
                            <form
                                className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                <div className="input-group">
                                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                                        aria-label="Search" aria-describedby="basic-addon2"/>
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                            <i className="fa fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <ul className="navbar-nav ml-auto">

                                <li className="nav-item dropdown no-arrow d-sm-none">
                                    <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa fa-search fa-fw"></i>
                                    </a>
                                    
                                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                        aria-labelledby="searchDropdown">
                                        <form className="form-inline mr-auto w-100 navbar-search">
                                            <div className="input-group">
                                                <input type="text" className="form-control bg-light border-0 small"
                                                    placeholder="Search for..." aria-label="Search"
                                                    aria-describedby="basic-addon2"/>
                                                <div className="input-group-append">
                                                    <button className="btn btn-primary" type="button">
                                                        <i className="fa fa-search fa-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </li>

                                <li className="nav-item dropdown no-arrow mx-1">
                                    <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa fa-bell fa-fw"></i>
                                        
                                        <span className="badge badge-danger badge-counter">3+</span>
                                    </a>
                                    
                                    <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="alertsDropdown">
                                        <h6 className="dropdown-header">
                                            Alerts Center
                                        </h6>
                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                            <div className="mr-3">
                                                <div className="icon-circle bg-primary">
                                                    <i className="fa fa-file-alt text-white"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="small text-gray-500">December 12, 2019</div>
                                                <span className="font-weight-bold">A new monthly report is ready to download!</span>
                                            </div>
                                        </a>
                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                            <div className="mr-3">
                                                <div className="icon-circle bg-success">
                                                    <i className="fa fa-donate text-white"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="small text-gray-500">December 7, 2019</div>
                                                A token has been deposited into your account!
                                            </div>
                                        </a>
                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                            <div className="mr-3">
                                                <div className="icon-circle bg-warning">
                                                    <i className="fa fa-exclamation-triangle text-white"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="small text-gray-500">December 2, 2019</div>
                                                Token returned to your account.
                                            </div>
                                        </a>
                                        <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                                    </div>
                                </li>

                                <li className="nav-item dropdown no-arrow mx-1">
                                    <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa fa-envelope fa-fw"></i>
                                        
                                        <span className="badge badge-danger badge-counter">7</span>
                                    </a>
                                    
                                    <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="messagesDropdown">
                                        <h6 className="dropdown-header">
                                            Message Center
                                        </h6>
                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                            <div className="dropdown-list-image mr-3">
                                                <img className="rounded-circle" src="img/undraw_profile_1.svg"
                                                    alt=""/>
                                                <div className="status-indicator bg-success"></div>
                                            </div>
                                            <div className="font-weight-bold">
                                                <div className="text-truncate">Hi there! I am wondering if you can help me with a
                                                    problem I've been having.</div>
                                                <div className="small text-gray-500">Emily Fowler · 58m</div>
                                            </div>
                                        </a>
                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                            <div className="dropdown-list-image mr-3">
                                                <img className="rounded-circle" src="img/undraw_profile_2.svg"
                                                    alt=""/>
                                                <div className="status-indicator"></div>
                                            </div>
                                            <div>
                                                <div className="text-truncate">I have the photos that you ordered last month, how
                                                    would you like them sent to you?</div>
                                                <div className="small text-gray-500">Jae Chun · 1d</div>
                                            </div>
                                        </a>
                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                            <div className="dropdown-list-image mr-3">
                                                <img className="rounded-circle" src="img/undraw_profile_3.svg"
                                                    alt=""/>
                                                <div className="status-indicator bg-warning"></div>
                                            </div>
                                            <div>
                                                <div className="text-truncate">Last month's report looks great, I am very happy with
                                                    the progress so far, keep up the good work!</div>
                                                <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                                            </div>
                                        </a>
                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                            <div className="dropdown-list-image mr-3">
                                                <img className="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                                                    alt=""/>
                                                <div className="status-indicator bg-success"></div>
                                            </div>
                                            <div>
                                                <div className="text-truncate">Please, send the reports as soon as possible</div>
                                                <div className="small text-gray-500">AIIMS · 2w</div>
                                            </div>
                                        </a>
                                        <a className="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                                    </div>
                                </li>

                                <div className="topbar-divider d-none d-sm-block"></div>

                                <li className="nav-item dropdown no-arrow">
                                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">Douglas McGee</span>
                                        <img className="img-profile rounded-circle"
                                            src="undraw_profile.svg"/>
                                    </a>
                                   
                                    
                                </li>

                            </ul>

                    </nav>
                    <div className="container-fluid">

                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                            <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                            
                            <a href={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                    className="fa fa-download fa-sm text-white-50"></i> Generate Report</a>
                        </div>


                        <div className="row">
                          
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card border-left-primary shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                     Tokens in Circulation</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.placs.length}</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fa fa-calendar fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card border-left-success shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                    Total Mints</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{10-this.state.placs.length}</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fa fa-dollar-sign fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card border-left-info shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Tasks
                                                </div>
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col-auto">
                                                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">50%</div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="progress progress-sm mr-2">
                                                            <div className="progress-bar bg-info" role="progressbar" aria-valuenow= "50" aria-valuemin="0" aria-valuemax="100"
                                                                style= {{width: "50%" }}>    
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fa fa-clipboard-list fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card border-left-warning shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                    Pending Requests</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">18</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fa fa-comments fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">

                        <div className="col-xl-8 col-lg-7">
                                <div className="card shadow mb-4">
                                    
                                <div
                                        className="card-header py-3 d-flex flex-row align-items-center justify-content-between" id="blu">
                                        <h6 className="m-0 font-weight-bold text-primary">Chart and Plots
                                        </h6>
                                        
                                    </div>
                                 
                                  <div className="card-body">
                                  <h1>The Big Picture</h1>
                                        < Map />
                                        
                                  </div>
                              </div>
                          </div>
                     


                            <div className="col-xl-4 col-lg-5">
                                <div className="card shadow mb-4">
                                    
                                <div
                                        className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">Generate 
                                        </h6>
                                        
                                    </div>
                                 
                                  <div className="card-body" style={{paddingTop:'50px', paddingBottom:'25px'}}>
                                  <h1>Mint Tokens</h1>
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
                                        <div style={{paddingTop:'25px'}}>
                                        <input
                                            type='submit'
                                            className='btn btn-block btn-primary'
                                            value='MINT'
                                        /></div>
                                        </form>
                                        
                                  </div>
                              </div>
                          </div>
                      </div>

                

                      <div className="row" >

                        <div className="col-xl-6 col-lg-6">
                            <div className="card shadow mb-4">
                                  <div className="card-header py-3" >
                                      <h6 className="m-0 font-weight-bold text-primary">Send</h6>
                                  </div>
                                  <div className="card-body">
                                      <div className="text-center" id="#nop">
                                          <h1 >Issue Tokens</h1>
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
                                            <div style={{paddingTop:'25px'}}>
                                            <input
                                                type='submit'
                                                className='btn btn-block btn-primary'
                                                value='ISSUE'
                                                
                                            /></div>
                                            </form>
                                      </div>
                                      
                                  </div>
                              </div>
                              </div>
                           

                        <div className="col-xl-6 col-lg-6">
                            <div className="card shadow mb-4">     

                          
                                  <div className="card-header py-3">
                                      <h6 className="m-0 font-weight-bold text-primary">Change Report</h6>
                                  </div>
                                  <div className="card-body">
                                    <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >
                                    { this.state.balance > 0 ? <div > <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} style={{paddingLeft: '200px',height: "120px", width: "50%", paddingRight:'0'}} /></div> : <div><h6> No Report</h6></div>}
                                    
                                    </a>
                                    <p>&nbsp;</p>
                                    <h2>Change Report</h2>
                                    <form onSubmit={this.onSubmit} >
                                    <input type='file' onChange={this.captureFile} />
                                    <input type='submit' onSubmit={this.balof}/>
                                    </form>
                                  </div>
                             
                            </div>
                        </div>
                
                    </div>  
                    <div className = "row">
                        <div className="col-xl-7 col-lg-7">   
                            <div className="card shadow mb-4">
                                  <div className="card-header py-3" id="boo">
                                      <h6 className="m-0 font-weight-bold text-primary">Cases Around You</h6>
                                  </div>
                                  <div className="card-body">
                                      <h4 className="small font-weight-bold">Severe Conditions <span
                                              className="float-right">20%</span></h4>
                                      <div className="progress mb-4">
                                          <div className="progress-bar bg-danger" role="progressbar"
                                              aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style={{width: "20%" }}></div>
                                      </div>
                                      <h4 className="small font-weight-bold">Infected <span
                                              className="float-right">40%</span></h4>
                                      <div className="progress mb-4">
                                          <div className="progress-bar bg-warning" role="progressbar"
                                              aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"  style= {{width: "40%"}}></div>
                                      </div>
                                      <h4 className="small font-weight-bold">Light Symptoms <span
                                              className="float-right">60%</span></h4>
                                      <div className="progress mb-4">
                                          <div className="progress-bar" role="progressbar" 
                                              aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style= {{width: "60%"}}></div>
                                      </div>
                                      <h4 className="small font-weight-bold">Got Checked <span
                                              className="float-right">80%</span></h4>
                                      <div className="progress mb-4">
                                          <div className="progress-bar bg-info" role="progressbar" 
                                              aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style= {{width: "80%"}}></div>
                                      </div>
                                      <h4 className="small font-weight-bold">Recovery Rate <span
                                              className="float-right">Complete!</span></h4>
                                      <div className="progress">
                                          <div className="progress-bar bg-success" role="progressbar" 
                                              aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width:"40%" }}></div>
                                      </div>
                                  </div>
                              </div>
                              </div> 
                              <div className="col-xl-5 col-lg-5">   
                          <div className="card shadow mb-4">
                          <div
                                        className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                       
                                       <div> <h6 className="m-0 font-weight-bold text-primary">Call back tokens
                                        </h6>
                                        </div>
                                        
                            </div>
                              <div>{
                                    this.state.placs.length > 0 &&  this.state.placs.map((plac, key) => {
                                        return(
                                        
                                            
                                            <div>
                                            {plac.length>0 ?  
                                                
                                                    <div className="col-lg-5 mb-4">
                                                        <div className="card bg-primary text-white shadow" style  = {{marginLeft:30, marginTop:20}}>
                                                            <div className="card-body" >
                                                            <div>{plac}</div>
                                                                
                                                                <form onSubmit={(event) => {
                                                                    event.preventDefault()
                                                                    this.callb(plac)
                                                                    }}>
                                                                    
                                                                        <input
                                                                        type='submit'
                                                                        className='btn btn-block btn-info'
                                                                        value='CALLB'
                                                                        
                                                                        />
                                                                    </form>
                                                            </div>
                                                        </div>
                                                  
                                               
                                                </div> : <div> </div>}
                                    
                                           </div>
                                        )
                                    })
                                    }
                                    </div>
                                    </div></div>
                          </div>
                      </div>

                  
              </div>

              <footer className="sticky-footer bg-white">
                  <div className="container my-auto">
                      <div className="copyright text-center my-auto">
                          <span>Copyright &copy; Our Website 2020</span>
                      </div>
                  </div>
              </footer>
            
          </div>

        </div>
    </div>
    
    
    );
}
}

export default App;