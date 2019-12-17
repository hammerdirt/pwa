import React, { Component }from 'react'
import '../theAppCss.css'
import Loader from './SpinComp'
import { COMMENT_LIST } from '../apiUrls'
import {DISPOSITION, SUBJECT} from '../variablesToEdit'

class FetchComments extends Component{
    constructor(props){
        super(props)
        this.state = {
            comments:[]
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
        fetch(COMMENT_LIST)
            .then(response =>  response.json()
            .then(data => ({status: response.status, body: data})))
            .then(theData => {
                this.setState({
                    comments:theData.body,
                    status:theData.status
                }, this.props.commentsToState(theData.body))

            })
    }
    render(){
        const byReverseDate = (some_state) => {
            const what_i_want = some_state.sort((obj_one, obj_two) => Date.parse(obj_two.comment_date) - Date.parse(obj_one.comment_date))
            return what_i_want.slice(0, 3)
        }
        return(
            <div className="introCommentContainer">
                <h5>Recent changes:</h5>

            {
                this.state.comments.length > 0 ? byReverseDate(this.state.comments).map(obj => {
                    return (
                        <div key={`${obj.comment.substring(0, 8)}${obj.comment_date}`} className="introCommentDiv">
                            <div className="commentTitle">
                                {obj.doc_title}
                            </div>
                            <div className="commentSection">
                                {obj.comment_date.substring(0, 10)}
                            </div>
                            <div className="commentSectionOne">
                                subject: {SUBJECT[obj.subject]}
                            </div>
                            <div className="commentSectionTwo">
                                disposition: {DISPOSITION[obj.disposition]}
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
export default FetchComments
