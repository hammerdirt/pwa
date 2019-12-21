import React, { Component } from 'react';
import '../theAppCss.css';
import IsThereAConnection from './IsThereAConnection'
import UpdateBeachDataBase from './UpdateDataBase'
import { StatusBar } from '../posedDivs'

class NetWorkDatabase extends Component {
    constructor(props){
        super(props)
        this.state = {
            status:this.props.theCount ? false:true,
            dbIs:false,
            count:0,
        }
        this.changeStatus = this.changeStatus.bind(this)
    }
    componentDidMount () {
        this.setState({
            dbIs:this.props.dbIs,
            serverUp:this.props.serverUp
        })
        console.log("mounting App.js")
    }
    componentDidUpdate(prevProps) {
        if (this.props.serverUp !== prevProps.serverUp || this.props.dbIs !== prevProps.dbIs) {
            this.setState({
                dbIs:this.props.dbIs,
                serverUp:this.props.serverUp
            })
        }
    }
    componentWillUnmount() {
        console.log("unmounted");
    }
    changeStatus(e){
        e.preventDefault()
        if(this.state.status){
            this.setState({
                status: !this.state.status,
                count:1
            },this.props.makeState)

        }else{
            this.setState({
                status: !this.state.status
            })
        }
    }

    render(){
        const statusButton = () => {
            if(this.state.status){
                return (

                    <div className="indicatorTitleBlock baseBackground" style={{border:"2px solid #fff"}}>
                        <button onClick={this.changeStatus} className="indicatorButton jCenter">
                            Start
                        </button>
                        <div className="indicatorMessage baseBackground">
                            <p className="whiteText baseBackground" style={{fontFamily:"sans-serif", textAlign:"justify"}}>
                                Welcome to hammerdirt. To use this app you need data. If the last indicator says no data then "click it".
                            </p>
                            <p className="whiteText" style={{fontFamily:"sans-serif", textAlign:"justify"}}>
                                Depending on how the application is accesed the data will either be
                                stored or destroyed between visits. Given your access mode:
                            </p>
                            <div className="whiteText" style={{ textAlign:"justify", marginBottom:"1.2rem"}}>
                                <span style={{fontWeight:"bold" }}>
                                    {
                                        this.props.canStore ? `The data can be stored on your device, you can delete it at anytime.`: `We are unable to store data on your device between visits.`
                                    }
                                </span>
                            </div>
                        </div>
                        <UpdateBeachDataBase
                            dbIsOpen={this.props.dbIsOpen}
                            doesDbOpen={this.props.doesDbOpen}
                            isAnUpGradeNeeded={this.props.isAnUpGradeNeeded}
                            isErrorOnUpgrade={this.props.isErrorOnUpgrade}
                        />
                        <IsThereAConnection
                            dbIs={this.state.dbIs}
                            isThereData={this.props.isThereData}
                            thereIsData={this.props.thereIsData}
                            serverUp={this.props.serverUp}
                            checkConnectivity={this.props.connectionVerify}
                        />
                    </div>
                )
            }else{
                return (
                    <button onClick={this.changeStatus} className="indicatorTitle">{this.props.userName}: Network</button>
                )
            }
        }
        return (
                <StatusBar
                    className="aModalBox"
                    pose={this.state.status ? "open" : "closed"}
                >
                <div className="indicatorBar">

                        {
                            statusButton()
                        }
                        </div>


                </StatusBar>
      )
  }
}
export default NetWorkDatabase;
