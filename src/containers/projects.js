import React, { Component } from 'react'
import '../theAppCss.css'
import {ProjectData, currentProjects} from '../projectData'

class Projects extends Component {
    constructor(props){
        super(props)
        this.state = {
            showThese:"current"
        }
        this.showThese = this.showThese.bind(this)
    }
    componentDidMount () {
        console.log("mounting projects")
    }
    showThese(e){
        e.preventDefault()
        this.setState({
            showThese:e.target.value
        })
    }
    render(){
        const projectBlox = (obj) => {
            return (
                <div key={obj.name} className="projectContent">
                    <div className="projectTitle emphasis">
                        {obj.name}
                    </div>
                    <div className="projectTitle">
                        {obj.startDate} to {obj.endDate}
                    </div>
                    <div className="emphasis" style={{fontSize:".9rem", marginTop:"10px"}}>Description:</div>
                    <div className="projectSummary">
                        {obj.description}
                    </div>
                    <div className="emphasis" style={{fontSize:".9rem"}}>Our role:</div>
                    <div className="projectSummary">
                        {obj.hdRole}
                    </div>
                    <div className="emphasis" style={{fontSize:".9rem"}}>Results:</div>
                    <div className="projectSummary">
                        {obj.results}
                    </div>
                    <div className="emphasis" style={{fontSize:".9rem"}}>Partners:</div>
                    {
                        obj.partners.map( partner => {
                            if(partner.name === 'None'){
                                return (
                                    <div className="projectTitle" key={`${partner.name}${obj.name}`} style={{paddingLeft:0}}>
                                        {partner.name}
                                    </div>
                                )
                            }else{
                                return (
                                    <div className="projectTitle" key={`${partner.name}${obj.name}`} style={{paddingLeft:0}}>
                                        <a href={`"${partner.url}"`}>{partner.name}</a>
                                    </div>
                                )
                            }
                        })
                    }
                    <div className="emphasis" style={{fontSize:".9rem"}}>Repo</div>
                    {
                        obj.repo === "None" ? <div>None</div>:<a href={obj.repo}>{`${obj.name} repo`}</a>
                    }
                </div>
            )
        }
        return (
            <div className="wMin360 a-row100 jStart rel topLeft whtBackGround zOne">
                <div className="projectsIntro">
                    <div className="projectsIntroSub">
                        <h5>Current projects</h5>
                        <p>
                            We maintain our commitment to citizen science and the environment by continuing our beach-litter surveillance projects.
                            However, we are expanding our data services and plan on fielding our first IoT prototype in January 2020.
                        </p>
                    </div>
                    <div className="projectsIntroSub">
                        <p>
                            For more information on a project check the articles section or the Github repository.  If you would like to
                            get more details, contact roger [at] hammerdirt.
                        </p>
                        {
                            this.state.showThese === "current" ? (
                                <button className="articleControlButton articleControlPos" id="past-present-projects" value="past" onClick={this.showThese} >
                                    Show past projects
                                </button>
                            ):(
                                <button className="articleControlButton articleControlPos" id="past-present-projects" value="current" onClick={this.showThese} >
                                    Show current projects
                                </button>
                            )
                        }
                    </div>
                </div>

                    {
                        this.state.showThese === "current" ? currentProjects.map(obj => projectBlox(obj)):ProjectData.map(obj => projectBlox(obj))
                    }
            </div>
      );
  }
}
export default Projects;
