import React, { Component }from 'react'
import '../theAppCss.css'
import Loader from './SpinComp'
import { ARTICLE_LIST } from '../apiUrls'
// import {DISPOSITION, SUBJECT} from '../variablesToEdit'



class FetchArticles extends Component{
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
        fetch(ARTICLE_LIST)
            .then(response =>  response.json()
            .then(data => ({status: response.status, body: data})))
            .then(theData => {
                this.setState({
                    articles:theData.body,
                    status:theData.status
                })

            })
    }
    render(){
        return(
            <div className="introCommentContainer">
            <h5>Latest docs:</h5>

            {
                this.state.articles ? this.state.articles.slice(0, 3).map(obj => {
                    return (
                        <div key={obj.title} className="introCommentDiv">
                            <div className="commentTitle">
                                {obj.title}
                            </div>
                            <div className="commentSection">
                                {obj.date_created.substring(0, 10)}
                            </div>
                            <div className="commentSectionOne">
                                section:{obj.subject}
                            </div>
                            <div className="commentSectionTwo">
                                {obj.summary}
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
export default FetchArticles
