import React, { Component } from 'react';
import '../theAppCss.css'
import FetchComments from '../components/FetchComments'
import  FetchLatestSurveys from '../components/FetchLatestSurveys'
import FetchArticles from '../components/FetchArticles'
import FetchGitActions from '../components/FetchGitActions'

class Introduction extends Component {
    constructor(props){
        super(props)
        this.state = {

        }

    }
    async componentDidMount() {
        console.log("mounting the Introduction")
        this._isMounted = true
        this.setState({
            serverUp:this.props.serverUp
        })

    }
    componentDidUpdate(prevProps) {
        if (this.props.serverUp !== prevProps.serverUp) {
            this.setState({
                serverUp:this.props.serverUp
            })
        }
    }

    componentWillUnmount(){
        console.log("unmounting the Introduction")
        this._isMounted = false
    }

    render(){
        return (
            <div className="wMin360 a-row100P jStart rel topLeft whtBackGround hMin100V zOne">
                <div className="introDivOne">
                    <h1>hammerdirt !</h1>
                    <h5>Every day</h5>
                </div>
                <div className="introDivTwo">
                    {
                        this.state.serverUp ? <FetchLatestSurveys />:
                        <div className="introCommentContainer">
                        <h5>Recent surveys:</h5>
                            <div className="introCommentDiv jCenter aCenter">
                                <div className="commentSectionTwo">
                                    <h6>Cannot connect to server. Check the connection</h6>
                                </div>
                            </div>
                        </div>

                    }
                    {
                        this.state.serverUp ? <FetchGitActions />:
                        <div className="introCommentContainer">
                        <h5>Changes to repo:</h5>
                            <div className="introCommentDiv jCenter aCenter">
                                <div className="commentSectionTwo">
                                    <h6>Cannot connect to server. Check the connection</h6>
                                </div>
                            </div>
                        </div>

                    }
                    {
                        this.state.serverUp ? <FetchArticles />:
                        <div className="introCommentContainer">
                        <h5>Latest docs:</h5>
                            <div className="introCommentDiv jCenter aCenter">
                                <div className="commentSectionTwo">
                                    <h6>Cannot connect to server. Check the connection</h6>
                                </div>
                            </div>
                        </div>

                    }
                    {
                        this.state.serverUp ? <FetchComments commentsToState={this.props.commentsToState}/>:
                        <div className="introCommentContainer">
                        <h5>Latest changes:</h5>
                            <div className="introCommentDiv jCenter aCenter">
                                <div className="commentSectionTwo">
                                    <h6>Cannot connect to server. Check the connection</h6>
                                </div>
                            </div>
                        </div>

                    }
                </div>
            </div>
      );
  }
}
export default Introduction;
