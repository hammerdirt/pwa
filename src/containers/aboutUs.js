import React, { Component } from 'react';
import '../theAppCss.css'
import {useIndexedCursorGet} from '../helperMethods'
import { openDB } from 'idb/with-async-ittr.js'
import { Beach_Data, Beach_Data_Version} from '../dataBaseVariables'
import Loader from '../components/SpinComp'
import SkillsTable from '../components/SkillsTable'
import UserCard from '../components/UserCard'
import {SkilsExperience } from '../variablesToEdit'

class AboutUs extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
        this.getTheUsers = this.getTheUsers.bind(this)
    }
    componentDidMount() {
        console.log("mounting the AboutUs")
        this._isMounted = true
        this.getTheUsers()
    }
    getTheUsers(){
        const transActionState = (a_name, a_state) => {
            if(a_name){
                console.log("Adding data to state about us")
                this.setState({
                    [a_name]:a_state,
                })
            }else{
                console.log("indexed db failed")
            }
        }
        useIndexedCursorGet(Beach_Data, Beach_Data_Version, 'users', 'dataToUse', transActionState)
    }
    componentDidUpdate(prevProps) {
        if (this.props.selected !== prevProps.selected) {
            console.log("the AboutUs props have changed")
        }
    }
    componentWillUnmount(){
        console.log("unmounting the AboutUs")
        this._isMounted = false
    }
    render(){
        return (
            <div className="wMin360 a-row100 jStart rel topLeft whtBackGround zOne">
            <div className="a-column50 wMin360 pad1 marginT6vh">
                <h5>A partner</h5>
                <p>
                    Hammerdirt provides the essential services for collecting, analysing and storing data from citizen science projects and field sensors.
                    Whether you need a dedicated application or analyst support. We have the experience to turn field observations into dynamic data displays
                    for print or web applications.
                </p>
                <p>
                    We work great with both ends of the value chain. We are not "designers" of user interfaces or communication strategies. However we do use the same tools
                    as any other developer, thus facilitating communications between working groups. Our time in the field makes us particularly senistive to finding the simplest
                    solutions to application development and data visualization.
                </p>
            </div>
            <div className="a-column50 wMin360 pad1">
                <h5>Philosophy</h5>
                <p>
                    Crowd sourced environmental data is the state of the environment as documented by those who experience it. All environmental assessements and policies
                    should begin with an understanding of the individual experience defined by the observations from the people living in that environment.
                </p>
                <p>
                    <span className="emphasis">Collaboration</span> is understanding that nobody can be an expert at everything. We depend on the input of scientists from a variety of fields
                    to ensure that our analysis is appropriate and in context of the problems presented to us. You can depend on us to ensure that observational data is presented in an
                    objective and transparent manner.
                </p>
            </div>
            <div className="a-column50 wMin360 pad1">
                <SkillsTable header={"Things we do:"} tools={SkilsExperience[1].data}/>
            </div>
            <div className="a-column50 wMin360 pad1">
                <SkillsTable header={"The tools we use:"} tools={SkilsExperience[0].data}/>
            </div>
            <div style={{width:'100%', display:'flex', justifyContent:'flex-start', margin:"3vh 0", paddingLeft:"2vw"}}>
                <h4>
                    The team:
                </h4>
            </div>
            {
                this.state.dataToUse ? <UserCard userData={this.state.dataToUse} />:<Loader />
            }
            <div style={{width:'100%', display:'flex', justifyContent:'flex-start', marginTop:"10vh", paddingLeft:"2vw"}}>
                <h5>
                    Contact us roger [at] hammerdirt.ch
                </h5>
            </div>
        </div>
      );
  }
}
export default AboutUs;
