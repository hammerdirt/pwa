import React, { Component } from 'react'
import '../theAppCss.css'
import OurEditor from '../components/Editor'
import {CREATE_ARTICLE, ARTICLE_UPDATE} from '../apiUrls'
import {postPutArticle, thePayload }from '../jWTheaders'
import { ARTICLE_CHOICES } from '../variablesToEdit'
import { Beach_Data, Beach_Data_Version} from '../dataBaseVariables'
import { openDB } from 'idb/with-async-ittr.js'
import{ArticleModal, ArticleMenu} from '../posedDivs'


class CreateArticle extends Component {
    constructor(props){
        super(props)
        this.state = {
            titles:[],
            draft:true,
            pushToApp:false,
            title:"",
            subject:"",
            image:"",
            summary:"",
            clearEditor:false,
            drafts:false,
            useThisDraft:false,
            myArticlesToEdit:false,
            seeMenu:false,
            seeGuide:false,
        }
        this.retrieveReferenceTitles = this.retrieveReferenceTitles.bind(this)
        this.retrieveData = this.retrieveData.bind(this)
        this.draftDecision = this.draftDecision.bind(this)
        this.toPostOrNot = this.toPostOrNot.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onChangeDoc = this.onChangeDoc.bind(this)
        this.postIt = this.postIt.bind(this)
        this.clearForm = this.clearForm.bind(this)
        this.putDataToIndexedDB = this.putDataToIndexedDB.bind(this)
        this.getDrafts = this.getDrafts.bind(this)
        this.retrieveDraftArticles = this.retrieveDraftArticles.bind(this)
        this.retrieveExisitngArticles = this.retrieveExisitngArticles.bind(this)
        this.articleControls = this.articleControls.bind(this)
        this.seeGuide = this.seeGuide.bind(this)
        this.checkTheForm = this.checkTheForm.bind(this)
        this.catchServerResponse = this.catchServerResponse.bind(this)
    }
    componentDidMount () {
        console.log("mounting article creator")
        this._isMounted = true
        this._isMounted && this.setState({
            loggedIn:this.props.loggedIn,
            // tokenChecked:this.props.tokenChecked
            })
        this._isMounted && this.retrieveReferenceTitles()
        const areThereDrafts = this.retrieveData("draftArticles")
        areThereDrafts.then(data => data.length > 0 ? this._isMounted && this.setState({drafts:data}):console.log("no data"))
        if(this.props.loggedIn && this._isMounted){
            const db = openDB(Beach_Data, Beach_Data_Version)
            db.then(stuff => stuff.getAllFromIndex("articleSearchList", "owner", this.props.userData.id ))
                .then(data => this.setState({myArticlesToEdit:data}))
        }

    }
    componentWillUnmount(){
        console.log("unmounting article creator")
        this._isMounted = false
    }
    componentDidUpdate(prevProps) {
        console.log("updating article creator")
        if (this.props.loggedIn !== prevProps.loggedIn && this._isMounted) {
            this.setState({
                loggedIn:this.props.loggedIn,
                // tokenChecked:this.props.tokenChecked
            })
        } else if(this.props.loggedIn && !this.state.myArticlesToEdit){
            console.log("this might be causing that")
            const db = openDB(Beach_Data, Beach_Data_Version)
            db.then(stuff => stuff.getAllFromIndex("articleSearchList", "owner", this.props.userData.id ))
                .then(data => this.setState({myArticlesToEdit:data}))
        }
    }
    articleControls(){
        this.setState({
            seeMenu:!this.state.seeMenu,
        })
    }
    checkTheForm(){
        let {subject, image, summary,article} = this.state
        let status
        if(!subject || !image || !summary || !article ){
            status = false
        }else{
            status = true
        }
        return status
    }
    clearForm(e){
        e.preventDefault()
        this.setState({
            title:"",
            subject:"",
            article:"",
            summary:"",
            image:"",
            imageFile:false,
            clearEditor:true,
            getDrafts:false,
            useThisDraft:false,
            existing:false,
            seeMenu:true,

        })
    }
    draftDecision(){
        this.setState({draft:!this.state.draft})
    }
    getDrafts(e){
        e.preventDefault()
        let eventName = e.target.parentElement.name
        console.log("Requesting draft article")
        if (eventName === "get-drafts"){
            this.setState({
                getDrafts:!this.state.getDrafts,
                seeMenu:!this.state.seeMenu,

            })
        }
        this.setState({
                getDrafts:!this.state.getDrafts
            })
    }
    onChange(e){
        e.preventDefault()
        if (e.target.name === 'image'){
            this.setState({
                [e.target.id]:e.target.value,
                imageFile:e.target.files[0]
            })
        }else{
            this.setState({
                [e.target.id]:e.target.value
            })
        }
    }
    onChangeDoc(content){
        if (this.state.clearEditor){
            this.setState({
                clearEditor:false,
                article:content
            })
        }else{
            this.setState({
                article:content
            })
        }

    }
    async catchServerResponse(data){
        const my_reply = await data
        this.setState({
            serverReply:my_reply
        })
    }
    postIt(e){
        e.preventDefault()
        const {titles, draft, pushToApp, loggedIn, ...theArticle} = this.state

        const theParameters = {
            slug:this.state.slug,
            token:this.props.token,
            userId:this.props.userData.id,
            theData:theArticle,
            imageFile:this.state.imageFile
        }
        if (this.state.pushToApp && !this.state.existing){
            theParameters.method = "POST"
            theParameters.url = CREATE_ARTICLE
            postPutArticle(theParameters, this.catchServerResponse)
        }else if(this.state.draft){
            const putDataToDb = this.putDataToIndexedDB
            var reader = new FileReader();
            reader.onload = function(){
                var dataURL = reader.result
                const aPayLoad = thePayload(theArticle, dataURL)
                putDataToDb(aPayLoad)
            }
            reader.readAsDataURL(this.state.imageFile)
        }else if(this.state.pushToApp && this.state.existing){
            theParameters.method = "PUT"
            theParameters.url = ARTICLE_UPDATE
            theParameters.slug = this.state.slug
            postPutArticle(theParameters, this.catchServerResponse)
        }
    }
    putDataToIndexedDB = (data) => {
        const draftArticles = "draftArticles"
        const db = openDB(Beach_Data, Beach_Data_Version)
        db.then(function(db) {
            var tx = db.transaction(draftArticles, 'readwrite');
            var store = tx.objectStore(draftArticles);
            var item = data
            store.put(item);
            return tx.complete;
            }).then(function() {
                console.log('added item to the store !')
            })
    }
    retrieveData = async (storeName) => {
        const db = await openDB(Beach_Data, Beach_Data_Version)
        const theData = db.getAll(storeName)
        return theData
    }
    retrieveReferenceTitles = async () => {
        let data = await this.retrieveData("referenceTitles")
        this.setState({
            titles:data
        })
    }
    retrieveDraftArticles(e){
        let name = e.target.name
        let useMe = this.state.drafts.filter(obj => obj.title === name)
        let data = useMe[0]
        const checkForData = () => {
            if (typeof useMe[0].article === 'undefined'){
                useMe[0].article = "no article text"
                return useMe
            }else{
                return useMe
            }
        }
        this.setState({
            title:data.title,
            subject:data.subject,
            image:"",
            summary:data.summary,
            useThisDraft:checkForData(),
            getDrafts:!this.state.getDrafts
        })

    }
    retrieveExisitngArticles(e){
        e.preventDefault()
        console.log("retrieveing requested article")
        let articleSlug = e.target.value
        let term = ARTICLE_UPDATE + articleSlug
        let article = fetch(term)
        article.then(res => res.json()).then(data =>{
            this.setState({
                title:data.title,
                subject:data.subject,
                image:"",
                summary:data.summary,
                useThisDraft:[data],
                existing:true,
                slug:articleSlug,
                getDrafts:!this.state.getDrafts
            })
        })
    }
    seeGuide(e){
        e.preventDefault()
        this.setState({
            seeGuide:!this.state.seeGuide
        })
    }
    toPostOrNot(){
        this.setState({
            draft:false,
            pushToApp:!this.state.pushToApp,
        })
    }
    // Object { ok: true, status: 200 }

    render(){
        console.log(this.state.serverReply)
        return (
            <div className="createArticleWrapper">
                <div className="managementWrapper">
                    <button onClick={this.seeGuide} id="guideLines" className="buttonAdjustHeight articleControlButton articleControlPos">
                        Check here for the guidelines and best practices
                    </button>
                    <button onClick={this.getDrafts} id="guideLines" className="articleControlButton buttonAdjustWidth articleControlPos">
                        Manage existing articles
                    </button>
                    <button  onClick={this.articleControls} className="articleControlButton buttonAdjustWidth articleControlPos" >
                        Article actions
                    </button>
                </div>
                <form className="formWrapper">
                    <div className="formSectionRow formSection">
                        <div className="formItem100">
                            <h6 className="inputLabel">Title</h6>
                            <input className="summaryInput" type="text" onChange={this.onChange} value={this.state.title} id="title" name="title" required minLength="4" maxLength="40" />
                        </div>
                    </div>

                    <div className="formSectionRow formSection">
                        <div className="formItem">
                            <h6 className="inputLabel"> Subject</h6>
                            <select className="summaryInput" onChange={this.onChange} value={this.state.subject} name="subject" id="subject" >
                                <option value="">--Select a subject--</option>
                                {
                                    ARTICLE_CHOICES.map(choice =>{
                                        return <option key={`${choice}`}value={`${choice}`}>{choice}</option>
                                    }
                                    )
                                }
                            </select>
                        </div>
                        <div className="formItem">
                            <h6 className="inputLabel">Title image</h6>
                            <input className="summaryInput" type="file" id="image" name="image" onChange={this.onChange} value={this.state.image} accept="image/*" />
                        </div>
                    </div>
                    <div className="formSectionRow formSection">
                        <div className="formItem">
                            <h6 className="inputLabel">Article summary</h6>
                            <input className="summaryInput" type="text" id="summary"  onChange={this.onChange} value={this.state.summary} name="summary" required minLength="4" maxLength="200" />
                        </div>

                    </div>
                    <div className="formSection formSectionRow" >
                        <OurEditor id={`theEditor`} clearEditor={this.state.clearEditor} drafts={this.state.useThisDraft} onEditorChange={content => this.onChangeDoc(content)}/>
                    </div>
                </form>
                <ArticleMenu pose={this.state.seeMenu ? 'open':'closed'} className="surveyModal">
                    <div style={{display:"flex", padding:"1vw", width:"25vw", minWidth:'200px', height:"auto", flexFlow:"row nowrap", boxSizing:"border-box"}}>
                        <div style={{padding:"1vw", width:"100%", boxSizing:"border-box", backgroundColor:"#ffffff", border:"2px dashed #3c6382"}}>
                            <div style={{marginBottom:"1vh"}}>
                                {
                                    this.checkTheForm() ? (
                                        this.state.pushToApp  ? (
                                            <button className="articleControlButton articleControlNeg">
                                                Save to server deletes local copy
                                            </button>
                                        ):(this.state.draft ? (
                                            <button onClick={this.draftDecision} id="saveToLocalYes" className="articleControlButton articleControlPos">
                                                Saving to local
                                            </button>
                                            ):(
                                                <button onClick={this.draftDecision} id="saveToLocalNo" className="articleControlButton articleControlNeg">
                                                    Discarding local
                                                </button>
                                            )
                                        )
                                    ):(
                                        <button disabled={true} id="notAuthenticated" className="articleControlButton articleControlCat">
                                            Cannot save to local
                                        </button>
                                    )
                                }
                            </div>
                            <div style={{marginBottom:"1vh"}}>
                                {
                                    this.checkTheForm() ?(
                                        this.state.pushToApp ?  (
                                            <button onClick={this.toPostOrNot} id="pushToAppYes" className="articleControlButton articleControlPos">
                                                Saving to app
                                            </button>
                                        ):(
                                            <button onClick={this.toPostOrNot} id="pushToAppNo" className="articleControlButton articleControlNeg">
                                                Not saving to app
                                            </button>
                                        )

                                    ):(
                                        <button disabled={true} id="notAuthenticated" className="articleControlButton articleControlCat">
                                            Cannot save to server
                                        </button>
                                    )
                                }
                            </div>
                            <div style={{marginBottom:"1vh"}}>
                                {
                                    this.state.loggedIn && this.checkTheForm() ? (
                                        <button onClick={this.postIt} id="authenticated" className="articleControlButton articleControlPos">
                                            Do this
                                        </button>
                                    ):(
                                    <button disabled={true} id="notAuthenticated" style={{fontWeight:"bold"}} className="articleControlButton articleControlNeg">
                                        ! Not logged in or form missing data !
                                    </button>)
                                }
                            </div>
                            <div style={{marginBottom:"1vh"}}>
                            {
                                this.state.serverReply ? this.state.serverReply.status === 200 ? <h5> Saved to server </h5>:<h4>There was an error, try resending</h4>:<div>Article not saved yet</div>
                            }
                            </div>
                            <div style={{marginBottom:"1vh"}}>
                                <button onClick={this.clearForm} id="clearTheForm" className="articleControlButton articleControlNeg">
                                    <i>Clear the form</i>
                                </button>
                            </div>
                            <button  onClick={this.articleControls} className="articleControlButton articleControlNeg" name="articleControls">
                                Close this menu
                            </button>
                        </div>
                    </div>
                </ArticleMenu>
                <ArticleModal className="aModalBackground articleModal" pose={this.state.getDrafts ? 'open':'closed'}>
                    <div className="LoadFromDraft">
                        <div className="loadSection ">

                                <h6 style={{color:"#0a3d62"}}>Draft articles on your device:</h6>

                            {
                                this.state.drafts ? this.state.drafts.map(obj => {
                                    return (
                                        <button className="articleControlButton articleControlPos" style={{width:"auto", height:"8vh", flex:"0 0 20%", display:"inline-block"}} name={obj.title} key={obj.title} value={obj.title} onClick={this.retrieveDraftArticles}>
                                            {obj.title}
                                        </button>
                                    )
                                }):"You have no draft articles "
                            }
                        </div>
                        <div className="loadSection ">
                            <div style={{width:"100%", boxSizing:"border-box", flex:"0 0 auto"}}>
                                <h6 style={{color:"#0a3d62"}}>Your current articles on the app:</h6>
                            </div>
                            {
                                this.state.myArticlesToEdit ? this.state.myArticlesToEdit.map(obj => {
                                    return (
                                        <button className="articleControlButton articleControlPos" style={{width:"auto", margin:".5rem", height:"8vh", flex:"0 0 20%", display:"inline-block"}} name={obj.slug} key={obj.slug} value={obj.slug} onClick={this.retrieveExisitngArticles}>
                                            {obj.title}
                                        </button>
                                    )
                                }):"You have no existing articles "
                            }
                        </div>
                        <button onClick={this.getDrafts} id="existingArticlesYes" className="articleControlButton articleControlPos">
                            <i>Close menu</i>
                        </button>
                    </div>
                </ArticleModal>
                <ArticleModal className="aModalBackground articleModal"  pose={this.state.seeGuide ? 'open':'closed'}>
                    <div className="surveyGuide">
                    <button onClick={this.seeGuide} id="existingArticlesYes" className="articleControlButton articleControlPos">
                        Close
                    </button>
                    <div>
                        <h6 style={{marginBottom:"1vh"}}>Creating an article</h6>
                        <p>
                            There are a few simple rules to follow:
                        </p>
                        <ul>
                            <li>The article must have a title</li>
                            <li>Select a subject from the drop down menu</li>
                            <li>A title image is required*</li>
                            <li>A short (max 200 characters) summary is required*</li>
                            <li>References/bibliography is required</li>
                        </ul>
                        <div>
                            <p className="muted">
                                *These are elements of the the article card
                            </p>
                        </div>
                        <h6 style={{marginBottom:"1vh"}}>References/bibliography</h6>
                        <p>
                            The bibliography entries must come from the reading list, if you have not entered the references into the
                            database you should do that before writing the article.
                        </p>
                        <h6 style={{marginBottom:"1vh"}}>Saving and posting</h6>
                        <p>
                            Authentication is required to save a draft article or to post to the app. If you post to the app there is no option to "save to local".
                            If you need to edit an existing (previously posted) article then you have that option when you select "see existing". The updated article will be posted
                            to the app.
                        </p>
                    </div>
                    <button onClick={this.seeGuide} id="existingArticlesYes" className="articleControlButton articleControlPos">
                        Close
                    </button>
                </div>
                </ArticleModal>
            </div>
      );
  }
}
export default CreateArticle;
