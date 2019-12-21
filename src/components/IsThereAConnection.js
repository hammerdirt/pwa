import React, { Component } from 'react'
import '../theAppCss.css'
import GetNewData from './AddDataToDataBase'
import { Beach_Data} from '../dataBaseVariables'
import {theDataStores} from '../variablesToEdit'

class IsThereAConnection extends Component{
    constructor(props){
        super(props)
        this.state ={
            serverUp:false,
            status:false
        }
        this.checkTheConnection = this.checkTheConnection.bind(this)
        this.aStatus = this.aStatus.bind(this)
        this.displayTheStatus = this.displayTheStatus.bind(this)
    }
    componentDidMount(){
        console.log("mounting connection check")
        this._isMounted = true
        this.checkTheConnection(this.props.serverUp)
        this.props.checkConnectivity()
    }
    componentDidUpdate(prevProps) {
        if (this.props.dbIs !== prevProps.dbIs  || this.props.serverUp !== prevProps.serverUp) {
            this.setState({
                dbIs:this.props.dbIs,
                serverUp:this.props.serverUp
            }, this.checkTheConnection(this.props.serverUp))
        }
    }
    componentWillUnmount(){
        console.log("unmounting connection check")
        this._isMounted = false
    }
    checkTheConnection(connection){
        if(connection && this._isMounted){
            this.setState({
                status:this.aStatus(true)
                })
            }else if(!connection && this._isMounted){
                this.setState({
                    status:this.aStatus(false)
                })
            }
        }
    aStatus(connection){
        let theStatus
        if(connection && this.props.dbIs){
            theStatus = 3
        }
        else if (connection && !this.props.dbIs) {
            theStatus = 2
        }
        else if (!connection && this.props.dbIs) {
            theStatus = 1
        }
        else{
            theStatus = 0
        }
        return theStatus
    }
    displayTheStatus(dataStatus){
        let message
        if (dataStatus === 3){
            message = {color:"#38ada9", message:"All good"}
        }
        else if (dataStatus === 2) {
            message = {color:"#b71540", message:"Update your browser"}
        }
        else if (dataStatus === 1){
            message = {color:"#b71540", message:"No data service"}
        }
        else if (dataStatus === 0){
            message = {color:"#b71540", message:"No service, old browser"}
        }
        return [message]
    }
    render(){
        return(
            <>
                <div key="status-one" className="statusWrapper" >
                    {
                        this.state.status ? this.displayTheStatus(this.state.status).map(obj => <div key={`${obj.color}${obj.message}1`}className="indicatorWrapper whiteText"><div className="indicator" style={{backgroundColor:obj.color}}></div> Network: {obj.message} </div>):
                        <div key="waitingOne" className="indicatorWrapper whiteText"><div className="indicator" style={{backgroundColor:"#b71540"}}></div> Network:"waiting" </div>
                    }
                </div>

                    {
                        this.state.status === 3 ? <GetNewData dataStores={theDataStores} dataBase={Beach_Data} isThereData={this.props.isThereData} />:
                        this.state.status ? this.displayTheStatus(this.state.status).map(obj => <div key={`${obj.color}${obj.message}3`} className="indicatorWrapper whiteText"><div className="indicator" style={{backgroundColor:obj.color}}></div>{obj.message} </div>):
                        <div key="waitingTwo" className="indicatorWrapper whiteText"><div className="indicator" style={{backgroundColor:"#b71540"}}></div> Network:"waiting" </div>
                    }

            </>
        )
    }

}

export default IsThereAConnection
