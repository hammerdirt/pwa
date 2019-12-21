import React, { Component } from 'react';
import '../theAppCss.css'
import { ARTICLE_LIST, CREATE_COMMENT } from '../apiUrls'
import {ArticleModal, Item,  ArticleMenu} from '../posedDivs'
import { PoseGroup } from 'react-pose'
import Loader from '../components/SpinComp'
import {retrieveData, useIndexedCursorGet} from '../helperMethods'
import { openDB } from 'idb/with-async-ittr.js'
import { Beach_Data, Beach_Data_Version} from '../dataBaseVariables'
import CommentDisplay from '../components/CommentDisplay'
import {SUBJECT, DISPOSITION} from '../variablesToEdit'
import OurReader from '../components/Reader'
import {saveToServer} from '../jWTheaders'
import Prism from 'prismjs'
// import '../prism.css'


class ReadArticles extends Component {
    constructor(props){
        super(props)
        this.state = {
            articles:false,
            selectedArticles:[],
            modalState:false,
            sortOrder:false,
            showThisArticle:{},
            subject:'Docs',
            seeSubjects:false,
        }
        this.showThisArticle = this.showThisArticle.bind(this)
        this.closeTheModal = this.closeTheModal.bind(this)
        this.selectASubject = this.selectASubject.bind(this)
        this.seeSubjects = this.seeSubjects.bind(this)
        this.useTheseComments = this.useTheseComments.bind(this)
        this.onChangeX = this.onChangeX.bind(this)
        this.checkTheForm = this.checkTheForm.bind(this)
        this.commentFormOnClick =this.commentFormOnClick.bind(this)
        this.commentSubmit = this.commentSubmit.bind(this)
        this.getTheUserData = this.getTheUserData.bind(this)
    }
    async componentDidMount() {
        this._isMounted = true
        console.log("mounting articles")
        let getArticles = fetch(ARTICLE_LIST)
        getArticles.then(res => res.json()).then(json => this.setState({ articles:json, sortOrder:json},console.log("articles are here")))
        this._isMounted && this.setState({
            loggedIn:this.props.loggedIn,
            subs:Object.keys(SUBJECT).map(value => SUBJECT[value]),
            disps:Object.keys(DISPOSITION).map(value => DISPOSITION[value])
        })
        this.getTheUserData()
    }
    componentDidUpdate(prevProps) {
        if (this.props.loggedIn !== prevProps.loggedIn|| this.props.serverUp !== prevProps.serverUp) {
            this.setState({
                dbIs:this.props.dbIs,
                serverUp:this.props.serverUp
            })
        }
    }
    componentWillUnmount(){
        console.log("unmounting articles")
        this._isMounted = false
    }
    selectASubject(e){
        e.preventDefault(e)
        this.setState({
            subject:e.target.value,
            selectedArticles:this.state.articles.filter(obj => obj.subject === e.target.value),
            seeSubjects:!this.state.seeSubjects
        })
    }
    getTheUserData(){
        const transActionState = (a_name, a_state) => {
            if(a_name){
                console.log("Adding data to state read articles")
                this.setState({
                    [a_name]:a_state,
                    idName:a_state.map(obj => Object.assign({},obj.id, obj.username)),
                })
            }else{
                console.log(a_state)
            }
        }
        useIndexedCursorGet(Beach_Data, Beach_Data_Version, 'users', 'userList', transActionState)
    }
    showThisArticle = a_title => e => {
        e.preventDefault()
        console.log("Edge test -- showing this article ")
        console.log(this.state.selectedArticles)
        const theArticle = this.state.selectedArticles.filter(obj => obj.title === a_title)
        this.setState({
            showThisArticle:theArticle,
            modalState:true,

        })
    }
    useTheseComments(){
        if(this.state.showThisArticle[0]){
            return this.props.comments.filter(obj => obj.doc_title === this.state.showThisArticle[0].title)
        }else{
            return false
        }
    }
    seeSubjects(e){
        e.preventDefault()
        this.setState({
            seeSubjects:!this.state.seeSubjects
        })
    }
    closeTheModal(e){
        e.preventDefault()
        this._isMounted && this.setState({
            modalState:false,
            showThisArticle:[],
        })
    }
    checkTheForm(){
        console.log("checking the form")
    }
    onChangeX(e){
        e.preventDefault()
        console.log(e.target.id)
        console.log(e.target.value)

        this.setState({
            [e.target.id]:e.target.value
        },this.checkTheForm())

    }
    commentFormOnClick(e){
        e.preventDefault()
        this.setState({
            [e.currentTarget.name]:e.currentTarget.value
        })
    }
    async commentSubmit(){
        let a_payload = {
            subject: Object.keys(SUBJECT).find(key => SUBJECT[key] === this.state.commentSubject),
            disposition: Object.keys(DISPOSITION).find(key => DISPOSITION[key] === this.state.commentDisposition),
            comment: this.state.aComment,
            doc_title: this.state.showThisArticle[0].title
        }
        let response = await saveToServer("POST",a_payload, CREATE_COMMENT, this.props.token)
        console.log(response.status)
    }
    render(){
        // Prism.highlightAll()
        const articleCard = (obj) =>{
            return(
                <div className="articleCardWrapper" onClick={this.showThisArticle(obj.title)} value={obj.title} key={`${obj.title}${obj.subject}`}>
                    <div className="articleCardTitle">
                        {obj.title}
                    </div>
                    <img className="articleCardImage" onClick={this.showThisArticle(obj.title)} value={obj.title} src={obj.image} alt="mathy stuff"/>
                    <div className="articleCardSummary">
                        {obj.summary}
                    </div>
                </div>
            )
        }
        const a_set = () =>{
            if (this.state.articles){
                let a_list = this.state.articles.map(obj => obj.subject)
                let a_set = new Set(a_list)
                return [...a_set]
            }
        }
        const the_set = a_set()
        function  getTheUserName(arr,value) {
            for (var i=0, iLen=arr.length; i<iLen; i++) {
                if (arr[i].id === value) return arr[i];
            }
        }
        const addUserNames = () => {
            let useTheseCommentsX = this.useTheseComments()
            if(useTheseCommentsX){
                useTheseCommentsX.forEach(obj =>{
                    let aName = getTheUserName(this.state.userList, obj.owner)
                    obj.username = aName.username
                })
            }
            return useTheseCommentsX
        }
        const useTheseCommentsX = addUserNames()
        return (
            <div className="wMin360 a-row100 jStart rel topLeft whtBackGround zOne">
                <div className="a-row100P">
                <div className="a-column50 jCenter">
                    <p className="pad1">
                        Docs: These are the basic components of current or completed projects. This includes the initial litterature review, business case, technical review, code samples or protocols for all hammerdirt operations.
                    </p>
                </div>
                <div className="a-column50 jCenter">
                    <div className="a-row wMin360 jCenter">
                        <button className="read-Button flexShrink50 " onClick={this.seeSubjects} > Subjects </button>
                    </div>
                </div>
                </div>
                <div className="a-rowAuto wMin360 jCenter" style={{marginTop:"3vh"}}>
                    <PoseGroup enterPose={'enter'} exitPose={'exit'}>
                        {
                            this.state.selectedArticles ? this.state.selectedArticles.map(obj => {return (<Item key={obj.title} className="poseItem" id={obj.title}> {articleCard(obj)} </Item>)}):<div key="empty-div"></div>

                        }
                    </PoseGroup>
                </div>
                <ArticleMenu pose={this.state.seeSubjects ? 'open':'closed'} className="surveyModal">
                    <div style={{display:"flex", padding:"1vw", width:"60%", minWidth:"280px", height:"auto", flexFlow:"row wrap", boxSizing:"border-box"}}>
                        {
                            the_set ? the_set.map(subject => {return <button key={subject} className="read-Button flexGrow50" style={{minWidth:"70px"}} onClick={this.selectASubject} value={subject}> {subject}</button>}):<Loader />
                        }
                    </div>
                </ArticleMenu>
                <ArticleModal pose={this.state.modalState ? 'open':'closed'} className="articleModal">
                <div className="articleModalGroup" style={{width:"100%", marginLeft:0}}>
                    {
                        this.state.showThisArticle.length > 0 ?( this.state.showThisArticle.map(obj => {
                            return (
                                <div key={obj.title} className="articleModal">


                                    <div className="articleWrapper">
                                        <div className="articleBlockTitle">
                                            <div className="articleTitle">
                                                <h5>{obj.title}</h5>
                                            </div>
                                            <div className="articleSubject">
                                                <h6>Subject: {obj.subject}</h6>
                                            </div>
                                            <div className="articleSummary">
                                                <p>
                                                {obj.summary}
                                                </p>
                                            </div>
                                            <div className="articleSummary">
                                                <h6>Contributor:
                                                {
                                                    this.state.userList ? ` ${getTheUserName(this.state.userList, obj.owner).username}`:<div></div>
                                                }
                                                </h6>

                                            </div>
                                            <button onClick={this.closeTheModal} value={false} className="articleControlButton articleControlPos">
                                                Close
                                            </button>
                                        </div>
                                        <div className="articleImage">
                                            <img src={obj.image} alt={obj.title} style={{width:"100%", height:"auto"}}/>
                                        </div>
                                        <div className="articleArticle">
                                            <OurReader id={`theEditor`} content={obj.article} />
                                        </div>
                                            {
                                                this.props.loggedIn ?
                                                (
                                                    <div className="a-column100">
                                                        <div className="sBarContainer">
                                                            <div className="formItem100 whtBackGround">
                                                                <h6 className="inputLabel">Your comment:</h6>
                                                                <input type="text" className="sBarInputX" id="aComment" onChange={this.onChangeX}
                                                                    value={this.state.aComment} autoComplete="off"
                                                                    name="aComment" onFocus={this.focusCodeX}
                                                                    placeholder="aComment"
                                                                />
                                                                <button  type="button" key={"send"} name={'commentDisposition'} value={this.state.submitComment} id={"send"} onClick={this.commentSubmit} className="sel-Button truncate">
                                                                    submit
                                                                </button>

                                                            </div>
                                                            <div className="formItem a-border whtBackGround">
                                                                <div className="a-row100P">
                                                                    <div className="flexGrowAuto w100P">
                                                                        <h4> Pick a subject:{` ${this.state.commentSubject}`}</h4>

                                                                    </div>

                                                                    {
                                                                        this.state.subs.map(value => {
                                                                            return(
                                                                            <button type="button" key={value} name={"commentSubject"} value={value} id={value} onClick={this.commentFormOnClick} className="sel-Button truncate">
                                                                                {value}
                                                                            </button>)
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="formItem a-border whtBackGround">
                                                                <div className="a-row100P jStart aCenter">
                                                                    <div className="flexGrowAuto w100P">
                                                                    <h4> Pick a subject:{` ${this.state.commentDisposition}`}</h4>
                                                                </div>
                                                                {
                                                                    this.state.disps.map(value => {
                                                                        return(
                                                                        <button  type="button" key={value} name={'commentDisposition'} value={value} id={value} onClick={this.commentFormOnClick} className="sel-Button truncate">
                                                                            {value}
                                                                        </button>)
                                                                    })
                                                                }
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>

                                                ):<div><h6>Log in to see comments or to make one </h6></div>

                                            }

                                        <div>
                                        {
                                            this.props.loggedIn && useTheseCommentsX ? <CommentDisplay key={"commentDisplay"}
                                                                        comments={useTheseCommentsX}
                                                                        />:<div></div>
                                        }

                                        </div>
                                        <button onClick={this.closeTheModal}  value={false} className="articleControlButton articleControlPos">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )
                        })):<div><h6>No articles Selected</h6></div>
                    }
                    </div>
                </ArticleModal>
            </div>
      );
  }
}
export default ReadArticles;
