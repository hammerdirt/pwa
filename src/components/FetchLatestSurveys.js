import React, { Component }from 'react'
import '../theAppCss.css'
import Loader from './SpinComp'
import { LATEST_DAILY_TOTALS} from '../apiUrls'

class FetchLatestSurveys extends Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }
    componentDidMount(){
        this._isMounted = true
        this.getTheComments()
    }
    componentWillUnmount(){
        this._isMounted = false
    }
    getTheComments(){
        fetch(LATEST_DAILY_TOTALS)
            .then(response =>  response.json()
            .then(data => ({status: response.status, body: data})))
            .then(theData => {
                this.setState({
                    theLatest:theData.body,
                    status:theData.status
                })

            })
    }
    render(){
        return(
            <div className="introCommentContainer">
            <h5>Recent surveys:</h5>
            {
                this.state.theLatest ? this.state.theLatest.slice(0, 2).map(obj => {
                    return (
                        <div key={obj.location} className="introCommentDiv">
                            <div className="commentTitle">
                            {obj.location}

                            </div>
                            <div className="commentSection">
                            {obj.date}
                            </div>
                            <div className="commentSectionOne">
                            quantity: {obj.daily_total}

                            </div>

                        </div>
                    )

                }):this.state.status ?(
                    <div className="introCommentDiv jCenter aCenter">
                        <div className="commentSectionTwo">
                            <h6> There was an error {this.state.status}</h6>
                        </div>
                    </div>

                ):(
                     <div className="introCommentDiv jCenter aCenter">
                        <Loader />
                    </div>
                )
            }
            </div>
        )

    }
}
export default  FetchLatestSurveys
