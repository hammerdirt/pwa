import React,  {Component}from 'react'
import { openDB } from 'idb';
import './theAppCss.css'
import {TheMainMenu} from './components/MainMenu'
import {Sect, ModalPose} from  './posedDivs'
import {PoseGroup} from 'react-pose'
import {theComponents} from './variablesToEdit'
import NetWorkDatabase from './components/NetWorkDatabase'
import {checkForDb, retrieveData} from './helperMethods'
import { Beach_Data, Beach_Data_Version} from './dataBaseVariables'
import {TOKEN_AUTH,VERIFY_TOKEN, ARE_WE_ONLINE} from './apiUrls'
// import {saveToServer} from './jWTheaders'

import {} from './helperMethods'
class AppStart extends Component{
    constructor(props){
        super(props)
        this.state = {
            open:false,
            menuWidth:0,
            loggedIn:false,
            windowWidth:1299,
            newKey:"Intro",
            dbIsOpen:false,
            anUpgradeIsNeeded:false,
            upgradeError:true,
            dbIs:false,
            responseDetail: "Credentials please...",
            serverUp:false,
        }
        this.startTrans = this.startTrans.bind(this)
        this.logMeOut = this.logMeOut.bind(this)
        this.checkAuth = this.checkAuth.bind(this)
        this.seeMenu = this.seeMenu.bind(this)
        this.doesDbOpen = this.doesDbOpen.bind(this)
        this.isAnUpGradeNeeded = this.isAnUpGradeNeeded.bind(this)
        this.isErrorOnUpgrade = this.isErrorOnUpgrade.bind(this)
        this.isThereData = this.isThereData.bind(this)
        this.test_mainMenuDims = this.test_mainMenuDims.bind(this)
        this.debounce = this.debounce.bind(this)
        this.makeState = this.makeState.bind(this)
        this.showTheUser = this.showTheUser.bind(this)
        this.authLogin = this.authLogin.bind(this)
        this.addCommentsToState = this.addCommentsToState.bind(this)
        this.tokenVerify = this.tokenVerify.bind(this)
        this.connectionVerify = this.connectionVerify.bind(this)
        this.checkConnectivity = this.checkConnectivity.bind(this)
    }
    async componentDidMount() {
        console.log("mounting the AppStart")
        this.test_mainMenuDims()
        this.connectionVerify()
        this._isMounted = true
        this.setState({
            dbIs:checkForDb(),
            windowWidth: window.innerWidth
        })
        if (navigator.storage && navigator.storage.persist){
            navigator.storage.persist().then(granted => {
              if (granted){
                  this.setState({
                      canStore:true
                  })
              }else{
                  this.setState({
                      canStore:false
                  })
              }
          })}
        window.addEventListener("resize", this.debounce);
    }
    test_mainMenuDims(){
        let fifteenVw = (window.innerWidth/100)*15
        fifteenVw > 220 ?
            this.setState({
                menuWidth:fifteenVw,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight
            })
        :
            this.setState({
                menuWidth:220,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight
            })
    }
    debounce(event){
        var time = 100
        return setTimeout(this.test_mainMenuDims, time, event);
    }
    componentDidUpdate(prevProps) {
        if (this.props.selected !== prevProps.selected) {
            console.log("the AppStart props have changed")
        }
    }
    componentWillUnmount(){
        console.log("unmounting the AppStart")
        window.removeEventListener("resize", this.debounce);
        this._isMounted = false
    }
    doesDbOpen(aBool){
        this.setState({
            dbIsOpen:aBool
        })
    }
    isAnUpGradeNeeded(aBool){
        this.setState({
            anUpgradeIsNeeded:aBool
        })
    }
    isErrorOnUpgrade(aBool){
        this.setState({
            upgradeError:aBool
        })
    }
    isThereData(aBool){
        this.setState({
            thereIsData:aBool
        })
    }
    startTrans(e){
        e.preventDefault()
        const selected = e.target.name
        let prevSelected = this.state.keyValue
        if (selected !==  prevSelected){
            const newState = () => this.setState({
                keyValue:selected,
                newKey:selected,
                })
            this.setState({
                keyValue:"",
                showThis:[],
            }, newState)
        }
    }
    addCommentsToState(data){
        this.setState({
            comments:data
        })
    }
    logMeOut(e){
        e.preventDefault()
        this.setState({
            loggedIn:false,
            responseDetail:"Staff login",
            refreshToken:"",
            token:"",
            tokenChecked:false,
            userName:"No login"
        })
    }
    checkAuth(e){
        e.preventDefault()
        console.log("check auth called!")
        this.setState({
            checkAuth:!this.state.checkAuth
        })
    }
    async showTheUser(username){
        var request = await indexedDB.open(Beach_Data)
        request.onsuccess = async (event) => {
            var db = await event.target.result
            var objectStore = await db.transaction("users").objectStore("users")
            const value = await objectStore.get(username)
            value.onsuccess = (event) => {
                this.setState({userDataToShow:value.result})
            }
        }
    }
    authLogin(event){
        event.preventDefault();
        console.log("authentication requested")
        const target = event.target
        const username = target.username.value
        const password = target.password.value
        let data = `{"username": "${username}", "password": "${password}"}`
        const makeRequest = fetch(TOKEN_AUTH, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: data,
        })
        makeRequest.then(response => response.json()
            .then(data => ({status: response.status, body: data})))
            .then(obj => {
                console.log(obj.status)
                console.log(obj.status === 200)
                if(obj.status === 200){
                    this.showTheUser(username)
                    this.setState({
                        response:obj.status,
                        token:obj.body.access,
                        refreshToken:obj.body.refresh,
                        loggedIn:true,
                        tokenChecked:true,
                        responseDetail:"Logged in!",
                        userName:username,
                    })
                }
                else if(obj.status === 400){
                    this.setState({
                        response:obj.status,
                        responseDetail:"Fill in both fields to login",
                        loggedIn:false,
                        userName:"No login",
                        token:"",
                        refreshToken:"",
                    })
                }
                else if(obj.status === 401){
                    this.setState({
                        response:obj.status,
                        responseDetail:obj.body.detail,
                        loggedIn:false,
                        userName:"No login",
                        token:"",
                        refreshToken:"",
                    })
                }
                else{
                    this.setState({
                        response:500,
                        responseDetail:"There was a network error",
                        loggedIn:false,
                        userName:"No login",
                        token:"",
                        refreshToken:"",
                    })

                }
            })

    }
    tokenVerify(theToken){
        const appHeader = {"Content-Type": "application/json"}
        const aPayload = JSON.stringify({"token":`${theToken}`})
        const verify = fetch(VERIFY_TOKEN, {
            method: "POST",
            headers: appHeader,
            body:aPayload
        })
        verify.then(data => this.setState({tokenIsVeriified:data.ok}))
    }
    connectionVerify(){
        console.log("checking the connection")
        const verify = fetch(ARE_WE_ONLINE)
        verify.then(data => data.status === 200 ? this.setState({serverUp:true}):null).catch(error => this.setState({serverUp:false}))
    }
    checkConnectivity(){
        console.log("calling the connection")
        this.connectionVerify()
    }
    seeMenu(e){
        e.preventDefault()
        this.setState({open:!this.state.open})
    }
    makeState = async () => {
        if(!this.state.makeState){
            console.log("!!!! Make State Got Called !!!!")
            const codes = await retrieveData("codes",Beach_Data, Beach_Data_Version, openDB)
            const mapData = await retrieveData("beaches", Beach_Data, Beach_Data_Version, openDB)
            this.setState({
                mlwCodes:codes,
                mapData:mapData,
                makeState:true,
            })
        }
    }
    render(){
        // console.log(this.state.tokenIsVeriified)
        // console.log(this.state.serverUp)
        const calcInitialMenuWidth = () => {
            if(this.state.menuWidth === 0){
                let fifteenVw = (window.innerWidth/100)*15
                if (fifteenVw > 220){
                    return fifteenVw
                }else{
                    return 220
                }
            }
        }
        const a_width = calcInitialMenuWidth()
        const methods = {returnComments:this.addCommentsToState, tokenVerify:this.tokemVerify, connectionVerify:this.checkConnectivity}
        return (
            <div className="w100V hAuto hMin100V wMin360 flx rel topLeft whtBackGround zOne">
                <TheMainMenu
                    open={this.state.open}
                    menuWidth={this.state.menuWidth === 0 ? a_width:this.state.menuWidth }
                    loggedIn={this.state.loggedIn}
                    windowWidth={this.state.windowWidth}
                    startTrans={this.startTrans}
                    logMeOut={this.logMeOut}
                    checkAuth={this.checkAuth}
                    seeMenu={this.seeMenu}
                    onValueChange={{x:this.state.menu_width}}

                />
                <NetWorkDatabase
                    dbIsOpen={this.state.dbIsOpen}
                    doesDbOpen={this.doesDbOpen}
                    isAnUpGradeNeeded={this.isAnUpGradeNeeded}
                    isErrorOnUpgrade={this.isErrorOnUpgrade}
                    dbIs={this.state.dbIs}
                    isThereData={this.isThereData}
                    thereIsData={this.state.thereIsData}
                    makeState={this.makeState}
                    userName={this.state.userName}
                    canStore={this.state.canStore}
                    connectionVerify={this.connectionVerify}
                    serverUp={this.state.serverUp}

                />
                <ModalPose pose={this.state.checkAuth ? 'open':'closed'} className="aModalBackground  a-row100 contCenter">
                    <div>
                    <div className="logInModal">
                        <form className="logInForm" onSubmit={this.authLogin}>
                                <div style={{display:"flex", padding:"0", justifyContent:"center", alignItems:"center", width:"100%", backgroundColor:"#3c6382"}} >
                                    <h6 style={{color:"#ffffff", margin:"0"}}>
                                        {
                                            this.state.responseDetail
                                        }
                                    </h6>
                                </div>
                                <div className="formItemLogin">
                                    <h6 className="inputLabel">User name:</h6>
                                    <input type="text"
                                           className="logInInput"
                                           name='username'
                                           id="usernameInput"
                                           aria-describedby="Username"
                                            />
                                </div>
                                <div className="formItemLogin">
                                    <h6 className="inputLabel">Password</h6>
                                    <input type="password"
                                           name="password"
                                          className="logInInput"
                                           id="passwordInput"
                                           aria-describedby="Password"
                                            />
                                </div>
                                <div className="formItemLogin">
                                    <button className="articleControlButton articleControlPos " type="submit" value="Log in">
                                        Log in
                                    </button>
                                </div>
                                <div className="formItemLogin">
                                    <button id="showLogIn" className="articleControlButton articleControlPos " onClick={this.checkAuth} name="showLogIn">
                                        Close menu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ModalPose>

                <PoseGroup animateOnMount>
                  <Sect key={this.state.newKey} selectedItemId={this.state.newKey}>
                    {theComponents({...this.state, ...methods})[this.state.newKey]}
                  </Sect>
                </PoseGroup>
            </div>
        );
    }
}

export default AppStart;
