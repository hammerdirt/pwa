import React, { Component }from 'react'
import '../theAppCss.css'
import {DISPOSITION} from '../variablesToEdit'


class DisplayComments extends Component{
    constructor(props){
        super(props)
        this.state = {
            comments:[]
        }
    }
    componentDidMount(){
        this._isMounted = true
    }
    componentDidUpdate(prevProps) {
        if (this.props.comments !== prevProps.comments) {
            this.setState({
                comments:this.props.comments
            })
            console.log("the AppStart props have changed")
        }
    }
    componentWillUnmount(){
        this._isMounted = false
    }
    render(){
        return(
            <div className="introCommentContainer" style={{marginBottom:"1vh", backgroundColor:"#fff"}}>
                <h5>Comments:</h5>

            {
                this.props.comments.length > 0 ? this.props.comments.map(obj => {
                    return (
                        <div key={`${obj.comment.substring(0, 8)}${obj.comment_date}`} style={{marginBottom:"1vh",backgroundColor:"rgba(229, 80, 57,.4)"}} className="introCommentDiv">
                            <div className="commentTitle">
                                {obj.comment}
                            </div>
                            <div className="commentSection">
                                {obj.comment_date.substring(0, 10)}
                            </div>
                            <div className="commentSectionOne">
                                member: {obj.username}
                            </div>
                            <div className="commentSectionTwo">
                                disposition: {DISPOSITION[obj.disposition]}
                            </div>
                        </div>
                    )

                }):(
                    <div className="introCommentDiv jCenter aCenter">
                        <div className="commentSectionTwo">
                            <h6> There are no comments </h6>
                        </div>
                    </div>

                )
            }
            </div>
        )
    }
}
export default DisplayComments
