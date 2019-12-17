import React, { Component } from 'react'
import '../theAppCss.css'
import {SURVEY_TO_SERVER} from '../apiUrls'
import { saveToServer }from '../jWTheaders'
import { Beach_Data, Beach_Data_Version} from '../dataBaseVariables'
import { openDB } from 'idb/with-async-ittr.js'
import{ArticleMenu, ArticleModal, SBarPose} from '../posedDivs'
import SurveyGuidelines from '../components/SurveyGuidelines'
import {postDataToStore, retrieveData, clearStore, clearItem} from'../helperMethods'

class EnterLitterSurvey extends Component {
    constructor(props){
        super(props)
        this.state = {
            pushToApp:false,
            location:false,
            length:0,
            date:false,
            code:false,
            codeToDisplay:false,
            quantity:0,
            surveyItems:false,
            clearEditor:false,
            seeMenu:false,
            guide:false,
            filteredCodes:false,
            codeSearch:"",
            time:false,
            missingData:true,
            freeze:"Lock location, date and length",
            frozen:false,
            draftSurveys:false,
            dbKey:false,
            savedToLocal:false,
            savedToServer:false,
            codeSearchPose:false,
            beachSearchPose:false,
            filteredBeaches:false,
            beachSearch:"",
        }
        this.clearForm = this.clearForm.bind(this)
        this.surveyControls = this.surveyControls.bind(this)
        this.addToSurvey = this.addToSurvey.bind(this)
        this.removeFromSurvey = this.removeFromSurvey.bind(this)
        this.seeGuide = this.seeGuide.bind(this)
        this.postThis = this.postThis.bind(this)
        this.checkTheForm = this.checkTheForm.bind(this)
        this.freeze = this.freeze.bind(this)
        this.loadDraftSurvey = this.loadDraftSurvey.bind(this)
        this.clearAllDrafts = this.clearAllDrafts.bind(this)
        this.filterCodesX = this.filterCodesX.bind(this)
        this.focusCodeX = this.focusCodeX.bind(this)
        this.onChangeX = this.onChangeX.bind(this)
        this.onChangeCodeX = this.onChangeCodeX.bind(this)
        this.searchCodes = this.searchCodes.bind(this)
        this.searchBeaches = this.searchBeaches.bind(this)
    }
    async componentDidMount () {
        console.log("mounting litter survey")
        const draftSurveys = await retrieveData('draftSurvey', Beach_Data, Beach_Data_Version, openDB)
        this.setState({
            loggedIn:this.props.loggedIn,
            token:this.props.token,
            draftSurveys:draftSurveys
            })
    }
    componentDidUpdate(prevProps) {
        console.log("updating litter survey")
        if (this.props.loggedIn !== prevProps.loggedIn || this.props.token !== prevProps.token) {
            this.setState({
                loggedIn:this.props.loggedIn,
                token:this.props.token
            })
        }
    }
    addToSurvey(e){
        e.preventDefault()

        if(this.state.quantity > 0 && this.state.codeToStore){
            const surveyObject = {
                code:this.state.codeToStore,
                display:this.state.codeToDisplay,
                quantity:this.state.quantity
            }
            if(this.state.surveyItems){
                const currentCodes = this.state.surveyItems.map(obj => {return (obj.code)})
                console.log(currentCodes)
                console.log(currentCodes.includes(this.state.codeToStore))
                if(currentCodes.includes(this.state.codeToStore)){
                    this.setState({
                        objectSelectionError:"That code has already been selected"
                    })

                }else{
                    const oldList = this.state.surveyItems
                    const newList = oldList.concat(surveyObject)
                    this.setState({
                        surveyItems:newList,
                        filteredCodes:[],
                        codeSearch:""
                    },this.checkTheForm())

                }
            }else{
                this.setState({
                    surveyItems:[surveyObject],
                    filteredCodes:[],
                    codeSearch:""
                },this.checkTheForm())
            }
        }else{
            this.setState({
                objectSelectionError:"Check the selection, either you are miissing a code/quantity or it has already been selected"
            })
        }
    }
    checkTheForm(){
        let {location, length, date, surveyItems, time, frozen} = this.state
        if(!location || !date || !length || !time || !surveyItems || !frozen){
            console.log("survey form is missing data")
            this.setState({
                missingData:true
            })
        }else{
            console.log("survey form is good to go")
            this.setState({
                missingData:false
            })
        }
    }
    clearAllDrafts(e){
        e.preventDefault(e)
        clearStore('draftSurvey', Beach_Data, Beach_Data_Version, openDB)
        this.setState({
            draftSurveys:[]
        })
    }
    clearForm(e){
        e.preventDefault()
        this.setState({
            quantity:0,
            location:false,
            surveyItems:false,
            time:false,
            date:false,
            length:0,
            codeToDisplay:false,
            savedToLocal:false,
            savedToServer:false,
            filteredCodes:false,
            filteredBeaches:false,
        })
    }
    filterBeaches(targetValue){
        let searchTerm = targetValue.toLowerCase()
        let filterTerms = this.props.mapData
        let filteredBeaches = filterTerms.filter(beach => beach.location.toLowerCase().startsWith(searchTerm, 0))
        this.setState({filteredBeaches:filteredBeaches})
    }
    filterCodesX(targetValue){
        let searchTerm = targetValue.toLowerCase()
        let filterTerms = this.props.mlwCodes
        let filteredCodes = filterTerms.filter(code => code.description.toLowerCase().startsWith(searchTerm, 0))
        this.setState({filteredCodes:filteredCodes})
    }
    focusCodeX(e){
        e.preventDefault()
        this.setState({
            codeSearch:"",
            filteredCodes:[],
            beachSearch:"",
        })
    }
    freeze(e){
        e.preventDefault()
        let {location, date, length} = this.state
        if(!location || !date || !length ){
            this.setState({
                freeze:"Lock location, date and length",
                frozen:false
            })
            return
        }else if(location && date && length ){
            this.setState({
                freeze:`Locked: ${location}-${date}`,
                frozen:[location, date, length]
            })
        }
    }
    loadDraftSurvey(e){
        e.preventDefault()
        let theDraft = this.state.draftSurveys.filter(obj => obj.surveyId === e.target.value)
        this.setState({
            location:theDraft[0].location,
            date:theDraft[0].date,
            length:theDraft[0].length,
            surveyItems:theDraft[0].surveyData,
            time:theDraft[0].time,
            dbKey:e.target.value,
            savedToLocal:false,
            savedToServer:false,
        })
    }
    onChangeX(e){
        e.preventDefault()
        if (e.target.name === 'code'){
            this.setState({
                codeSearch:e.target.value,
            }, this.filterCodesX(e.target.value))

        }else if(e.target.name === "beachSearch"){
            this.setState({
                beachSearch:e.target.value
            }, this.filterBeaches(e.target.value))
        }else if(e.target.name === "selectedBeach"){
            const the_selection = e.target.value
            this.setState({
                location:the_selection,
                beachSearch:e.target.value
            },this.filterBeaches(e.target.value))
        }else {
            this.setState({
                [e.target.id]:e.target.value
            },this.checkTheForm())
        }
    }
    onChangeCodeX(e){
        e.preventDefault(e)
        var re = new RegExp('.+?(?=:)')
        let to_store = e.target.value
        console.log(re.exec(to_store)[0])
        this.setState({
            codeToDisplay:to_store,
            codeToStore:re.exec(to_store)[0],
            codeSearch:to_store,
            filteredCodes:[]
        },this.checkTheForm())
    }
    async postThis(e){
        e.preventDefault()
        let {location, date, length, time, surveyItems} = this.state
        let location_slug = this.props.mapData.filter(obj => obj.location === location)
        let data = surveyItems.map(obj => Object.assign({}, {code:obj.code},{quantity:obj.quantity}, {location:location_slug[0].slug}, {date:date}, {length:length}))
        let surveyName = `${location}-${date}-${length}`
        let toLocal = {surveyId:surveyName, surveyData:surveyItems, location:location, date:date, length:length, time:time}
        if(e.target.value === "toLocal"){
            const goneToLocal = await postDataToStore('draftSurvey', Beach_Data, Beach_Data_Version, openDB, toLocal)
            console.log(goneToLocal)
            this.setState({
                freeze:"Lock location, date and length",
                frozen:false,
                location:false,
                length:0,
                date:false,
                time:false,
                missingData:true,
                dbKey:surveyName,
                surveyItems:false,
                savedToLocal:surveyName,
                filteredCodes:false,
            })
        }else if(e.target.value === "toApp" && this.state.token){
            let response = await saveToServer("POST",data, SURVEY_TO_SERVER, this.state.token)
            console.log(response.ok)
            if(this.state.dbKey && response.ok){
                console.log("Clearing form after succesfull server POST")
                clearItem('draftSurvey',surveyName, Beach_Data, Beach_Data_Version, openDB, toLocal)
                this.setState({
                    freeze:"Lock location, date and length",
                    frozen:false,
                    location:false,
                    length:0,
                    date:false,
                    time:false,
                    missingData:true,
                    surveyItems:false,
                    savedToServer:surveyName,
                    draftSurveys:false,
                    filteredCodes:false,

                })
            }
            else if(!this.state.dbKey && response.ok){
                this.setState({
                    freeze:"Lock location, date and length",
                    frozen:false,
                    location:false,
                    length:0,
                    date:false,
                    time:false,
                    missingData:true,
                    surveyItems:false,
                    savedToServer:surveyName,
                    filteredCodes:false
                })

            }
            else if(!response.ok){
                this.setState({
                    savedToServer:"Error unable to post",
                })
            }
        }
    }
    searchCodes(e){
        e.preventDefault()
        this.setState({
            codeSearchPose:!this.state.codeSearchPose,
            codeSearch:"",
            quantity:0,
        })
    }
    searchBeaches(e){
        e.preventDefault()
        this.setState({
            beachSearchPose:!this.state.beachSearchPose
        })
    }
    surveyControls(e){
        e.preventDefault()
        this.checkTheForm()
        this.setState({
            seeMenu:!this.state.seeMenu
        })
    }
    seeGuide(e){
        e.preventDefault()
        console.log("Guide called")
        this.setState({
            guide:!this.state.guide,
        })
    }
    removeFromSurvey(e){
        e.preventDefault()
        const removeMe = e.target.value
        console.log("removing something from current inventory")
        let surveyList = this.state.surveyItems
        let newList= surveyList.filter(obj => obj.code !== removeMe)
        newList.length > 0 ? this.setState({surveyItems:newList}):
        this.setState({
            surveyItems:false,
            quantity:0,
        },this.checkTheForm())
    }
    render(){
        console.log(this.state.quantity)
        return (
            <div className="sBarOuter">
                <div className="sBarOuter2">
                    <div className="surveyGuideButtonWrapper">
                        <button onClick={this.seeGuide} id="guideLines" className="articleControlButton articleControlPos surveyButtonHeight">
                            Check here for the guidelines and best practices
                        </button>
                    </div>
                    <div className="surveyFormWrapper">
                        <div className="buttonBar lightBackGround">
                            <div className="formItem marBot10">
                                <h6>Start here: find your beach.</h6>
                                <button onClick={this.searchBeaches} id="locked-survey" className="articleControlButton articleControlPos surveyButtonHeight">
                                {
                                    this.state.location ? `${this.state.location} selected`:`Search Beaches`
                                }
                                </button>
                            </div>
                            <div className="formItem marBot10">
                                <h6 className="inputLabel">Length</h6>
                                <input className="sBarInput" type="number" id="length" name="length" min="20" max="100" onChange={this.onChangeX} value={this.state.length} />
                            </div>
                            <div className="formItem marBot10">
                                <h6 className="inputLabel">Date</h6>
                                <input className="sBarInput" type="date" id="date"  name="date" onChange={this.onChangeX} value={this.state.date} />
                            </div>
                            <div className="formItem marBot10">
                                <h6 className="inputLabel">Time in minutes</h6>
                                <input className="sBarInput" type="number" id="time" min="0"  name="time" onChange={this.onChangeX} value={this.state.time} />
                            </div>
                        </div>
                        <div className="buttonBar lightBackGround">
                            <div className="formItem">
                            {
                                this.state.frozen ? (
                                    <button onClick={this.freeze} id="locked-survey" className="articleControlButton articleControlPos surveyButtonHeight">
                                        {this.state.freeze}
                                    </button>
                                ):(
                                    <button onClick={this.freeze} id="un-locked-survey" className="articleControlButton articleControlPos surveyButtonHeight">
                                        Lock in the location and length
                                    </button>
                                )
                            }
                            </div>
                            <div className="formItem">
                                <button onClick={this.surveyControls} id="existingArticlesYes" className="articleControlButton articleControlPos surveyButtonHeight">
                                    Manage surveys
                                </button>
                            </div>
                        </div>
                        <div className="surveyTableWrapper">
                            <div className="tableDiv">
                                <div className="tableHeaderRow">
                                    {
                                        this.state.location ? (
                                            <div key={this.state.location} className="truncate" >
                                                {this.state.location}: <span className="headerRowDetail">({this.state.date}, {`${this.state.length} meters`}, {`${this.state.time} mins`})</span>
                                            </div>
                                        ):
                                        (
                                            <div key="wating-for-data" className="">
                                                No selection
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    this.state.surveyItems ?  this.state.surveyItems.map(obj => (
                                        <div key={obj.code} className="tableRow">
                                            <div className="tableCellLabel truncate">
                                                {obj.display}
                                            </div>
                                            <div className="tableCellData">
                                                {obj.quantity}
                                            </div>
                                            <button onClick={this.removeFromSurvey} value={obj.code} className="tableCellButton">
                                            remove
                                            </button>
                                        </div>
                                    )):(
                                        <div className="tableRow">
                                            <div className="tableCellLabel">
                                                No selection
                                            </div>
                                            <div className="tableCellData">
                                                {this.state.quantity}
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="summaryRow">
                                    <div className="summaryCell">
                                        Total
                                    </div>
                                    <div className="summaryDataCell">
                                        {
                                            this.state.surveyItems ? (
                                                this.state.surveyItems.reduce((tot, record) => {return tot + parseInt(record.quantity)}, 0)
                                            ):0
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="surveyGuideButtonWrapper aMarginT10">
                        <button  onClick={this.searchCodes} style={{width:"100%"}} className="articleControlButton articleControlPos surveyButtonHeight" name="surveyControls">
                            Search MLW Codes
                        </button>
                    </div>
                </div>
                <SBarPose className="sBar" pose={this.state.beachSearchPose ? "open":"closed"}>
                    <div className="sBarWrapper marginT6vh">
                        <div className="sBarContainer">
                            <div className="formItem">
                                <h6 className="inputLabel">Search beach names:</h6>
                                <input type="text" className="sBarInput aMarginT10" id="beach" onChange={this.onChangeX}
                                        value={this.state.beachSearch} autoComplete="off"
                                        name="beachSearch" onFocus={this.focusCodeX}
                                        placeholder="Search... beach name"
                                    />
                            </div>
                            <div className="formItem truncate">
                                <button onClick={this.searchBeaches} id="close-beach-search" className="articleControlButton truncate articleControlPos surveyButtonHeight">
                                    {
                                        this.state.location ? `Inventory ${this.state.location}`:`No beach selected - close`
                                    }
                                </button>
                            </div>
                        </div>
                        <div  className="sBarSearchResults">
                            {
                                this.state.filteredBeaches && this.state.filteredBeaches.length > 0 ? this.state.filteredBeaches.map(obj => {
                                    return (
                                        <button className="articleControlButton articleControlSelect" id={obj.location} name="selectedBeach" key={obj.location}
                                            value={obj.location}
                                            onClick={this.onChangeX}
                                        >
                                                {obj.location}
                                        </button>
                                    )})
                                    :(
                                        <div  className=" aWhiteBorder truncate w100P" style={{height:"8vh", minHeight:"40px", backgroundColor:"#fff"}}>
                                           The search results will appear here.
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                </SBarPose>
                <SBarPose className="sBar" pose={this.state.codeSearchPose ? "open":"closed"}>
                    <div className="sBarWrapper marginT6vh">
                        <div className="sBarContainer">
                            <div className="formItem">
                                <h6 className="inputLabel" >Search MLW codes</h6>
                                <input type="text" className="sBarInput" id="code" onChange={this.onChangeX}
                                    value={this.state.codeSearch} autoComplete="off"
                                    name="code" onFocus={this.focusCodeX}
                                    placeholder="Search... code description"
                                />
                                {
                                    this.state.objectSelectionError ? <div>{this.state.objectSelectionError}</div>:<div></div>
                                }
                            </div>
                            <div className="formItem">
                                <h6 className="inputLabel">Quantity</h6>
                                <input className="sBarInput" type="number" id="quantity" min="0"  name="quantity" required={true} onChange={this.onChangeX} value={this.state.quantity}/>
                                <button  onClick={this.addToSurvey} className="articleControlButton articleControlPos aMarginT20" name="surveyControls">
                                    Add objects to inventory
                                </button>
                            </div>
                            <button  onClick={this.searchCodes}  className="articleControlButton articleControlPos aMarginT10" name="close-code-search">
                                    Close
                            </button>
                        </div>
                        <div  className="sBarSearchResults">
                            {
                                this.state.filteredCodes && this.state.filteredCodes.length > 0 ? this.state.filteredCodes.map(obj => {
                                    return (
                                        <button className="articleControlButton articleControlSelect" id={obj.code} key={obj.code}
                                            value={`${obj.code}: ${obj.description}`}
                                            onClick={this.onChangeCodeX} name={`${obj.code}-${obj.description}`}
                                        >
                                                {`${obj.code}: ${obj.description}`}
                                        </button>
                                    )})
                                    :(
                                        <div  className="truncate">
                                           The search results will appear here.
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                </SBarPose>
                <ArticleMenu pose={this.state.seeMenu ? 'open':'closed'} className="surveyModal">
                <div style={{display:"flex", padding:"1vw", width:"25vw", minWidth:"200px", height:"auto", flexFlow:"row nowrap", boxSizing:"border-box"}}>
                    <div style={{padding:"1vw", width:"100%", boxSizing:"border-box", backgroundColor:"#ffffff", border:"2px dashed #3c6382"}}>
                        <div style={{marginBottom:"1vh"}}>
                            {
                                this.state.savedToServer ? (
                                    <button id="pushToApp" key="pushToApp"  value="toApp" disabled={true} onClick={this.postThis} style={{fontSize:".7rem"}} className="articleControlButton articleControlCat">
                                        Saved to server:{this.state.savedToServer}
                                    </button>
                                ):
                                this.state.missingData ? (
                                    <button id="pushToApp" key="pushToApp"  value="toApp" disabled={true} onClick={this.postThis} className="articleControlButton articleControlCat">
                                        Unable to post - check form
                                    </button>
                                ):this.state.token ? (
                                    <button id="pushToApp" key="pushToApp" value="toApp" onClick={this.postThis} className="articleControlButton articleControlPos">
                                        Post to server
                                    </button>
                                ):(
                                    <button id="pushToApp" key="pushToApp"  value="toApp" disabled={true} onClick={this.postThis} className="articleControlButton articleControlCat">
                                        The login has expired
                                    </button>
                                )
                            }
                        </div>
                        <div style={{marginBottom:"1vh"}}>
                            {
                                this.state.savedToLocal ? (
                                    <button type="button" id="pushToLocal" key="pushToLocal" value="toLocal"  disabled={true}  className="articleControlButton articleControlCat">
                                        Saved to device:{this.state.savedToLocal}
                                    </button>

                                ):
                                this.state.missingData ? (
                                    <button type="button" id="pushToLocal" key="pushToLocal" value="toLocal"  disabled={true}  className="articleControlButton articleControlCat">
                                        Unable to save - check the form
                                    </button>
                                ):(
                                    <button type="button" id="pushToLocal" key="pushToLocal" value="toLocal" onClick={this.postThis} className="articleControlButton articleControlPos">
                                        Save on device
                                    </button>
                                )
                            }
                        </div>
                        <div style={{marginBottom:"1vh"}}>
                            <h6>Edit drafts on this device:</h6>
                            {
                                this.state.draftSurveys.length > 0 ? ( this.state.draftSurveys.map(obj =>{
                                    return(
                                    <button key={obj.surveyId} id="editSurvey" value={obj.surveyId} onClick={this.loadDraftSurvey} className="articleControlButton articleControlPos">
                                        Edit {obj.location}, {obj.date}
                                    </button>
                                    )
                                })
                                ):
                                (
                                    <button key={"none-to-edit"} disabled={true}  className="articleControlButton articleControlNeg">
                                        No surveys stored
                                    </button>
                                )
                            }
                        </div>
                        <div style={{marginBottom:"1vh"}}>
                            {
                                this.state.draftSurveys.length > 0 ? (
                                    <button  onClick={this.clearAllDrafts} className="articleControlButton articleControlCat">
                                        &#8680;! Clear all draft surveys !&#8678;
                                    </button>
                                ):
                                (
                                    <div></div>
                                )
                            }
                        </div>
                        <div style={{marginBottom:"1vh"}}>
                            <button onClick={this.surveyControls} id="existingArticlesYes" className="articleControlButton articleControlNeg">
                                Close menu
                            </button>
                        </div>
                    </div>
                    </div>
                </ArticleMenu>
                <ArticleModal className="aModalBackground articleModal" pose={this.state.guide ? 'open':'closed'}>
                    <SurveyGuidelines seeGuide={this.seeGuide}/>
                </ArticleModal>
            </div>

      );
  }
}
export default EnterLitterSurvey;
