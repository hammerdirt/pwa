import React, { Component }from 'react'
import '../theAppCss.css'
import Loader from './SpinComp'
// import { ARTICLE_LIST } from '../apiUrls'
// import {DISPOSITION, SUBJECT} from '../variablesToEdit'



class FetchGitActions extends Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }
    componentDidMount(){
        this.getTheComments()
        this._isMounted = true

    }
    componentWillUnmount(){
        this._isMounted = false

    }
    getTheComments(){
        fetch("https://api.github.com/users/hammerdirt/events")
            .then(response =>  response.json()
            .then(data => ({body: data})))
            .then(theData => {
                this.setState({
                    activities:theData.body,

                })

            })
    }
    render(){
        return(
            <div className="introCommentContainer">
            <h5>Changes to repo:</h5>
            {
                this.state.activities ? this.state.activities.slice(0, 1).map(obj => {
                    return (
                        <div key={obj.id} className="introCommentDiv">
                            <div className="commentTitle">
                                {obj.repo.name}
                            </div>
                            <div className="commentSection">
                                {obj.created_at.substring(0, 10)}
                            </div>
                            <div className="commentSectionOne">
                                Type:{obj.type}
                            </div>
                        </div>
                    )

                }):
                <div className="introCommentDiv jCenter aCenter">
                    <Loader />
                </div>
            }
            </div>

        )

    }
}
export default FetchGitActions
