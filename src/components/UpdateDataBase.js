import React, { Component } from 'react'
import '../theAppCss.css'
import { Beach_Data, Beach_Data_Version} from '../dataBaseVariables'

class UpdateBeachDataBase extends Component {
    constructor(props){
        super(props)
        this.state = {
            updateDataBase:false
        }
        this.updateTheDataBase = this.updateTheDataBase.bind(this)
        this.checkOrNot = this.checkOrNot.bind(this)
    }
    componentDidMount(){
        this._isMounted = true
        this.checkOrNot()

    }
    checkOrNot(){
        if(!this.props.dbIs && this._isMounted){
            console.log("checking the database")
            this.updateTheDataBase()
        }
    }
    componentWillUnmount(){
        this._isMounted = false
    }
    updateTheDataBase = async () => {

        var request = window.indexedDB.open( Beach_Data, Beach_Data_Version);
        console.log("Checking for indexedDB")


        const doesItOpen = this.props.doesDbOpen
        request.onsuccess = function (event) {
            console.log('The database is opened successfully');
            doesItOpen(true)
        };
        const upgradeOrNot =this.props.isAnUpGradeNeeded
        const upgradeError = this.props.isErrorOnUpgrade

        request.onupgradeneeded = function(event) {
            console.log("the upgrade is needed")
            upgradeOrNot(true)
            var db = event.target.result
            db.onerror = function(errorEvent){
                upgradeError(true)
            }
            if(!db.objectStoreNames.contains("beaches")) {
                var store = db.createObjectStore("beaches", { keyPath: "location",unique:true })
                store.createIndex("city", "city")
                store.createIndex("water", "water")
                store.createIndex("owner", "owner")
                store.createIndex("post", "post")
                store.createIndex("water_name", "water_name",)
                store.createIndex("slug", "slug")
            }
            if(!db.objectStoreNames.contains('users')) {
                var store2 = db.createObjectStore('users', {keyPath:"username"})
                store2.createIndex('position', 'position')
                store2.createIndex('hd_status', 'hd_status')
            }
            if(!db.objectStoreNames.contains('codes')) {
                var store3 = db.createObjectStore('codes', {keyPath:"code", unique:true})
                store3.createIndex("source", "source")
                store3.createIndex("material", "material")
            }
            if(!db.objectStoreNames.contains('dailyTotals')) {
                db.createObjectStore('dailyTotals', { keyPath: "location", unique:true })
            }
            if(!db.objectStoreNames.contains('waterBodyCodeTotals')) {
                db.createObjectStore('waterBodyCodeTotals', {keyPath: "location", unique:true})
            }
            if(!db.objectStoreNames.contains('cityCodeTotals')) {
                db.createObjectStore('cityCodeTotals', {keyPath:"location", unique:true})
            }
            if(!db.objectStoreNames.contains('postCodeTotals')) {
                db.createObjectStore('postCodeTotals', { keyPath:"location", unique:true })
            }
            if(!db.objectStoreNames.contains('beachesByCategory')) {
                db.createObjectStore('beachesByCategory', {  keyPath: "location" })
            }
            if(!db.objectStoreNames.contains('beachCategories')) {
                db.createObjectStore('beachCategories', { keyPath: "category"})
            }
            if(!db.objectStoreNames.contains('referenceTitles')){
                db.createObjectStore('referenceTitles', { keyPath : "title" })
            }
            if(!db.objectStoreNames.contains('draftArticles')){
                db.createObjectStore('draftArticles', { keyPath:"title" })
            }
            if(!db.objectStoreNames.contains('articleSearchList')){
                var storeFour = db.createObjectStore('articleSearchList', { keyPath:"title" })
                storeFour.createIndex("owner", "owner")
                storeFour.createIndex("subject", "subject")
            }
            if(!db.objectStoreNames.contains('draftSurvey')){
                db.createObjectStore('draftSurvey', {keyPath:'surveyId'})
            }
            if(!db.objectStoreNames.contains('lastUpdate')){
                db.createObjectStore('lastUpdate', {keyPath:'date'})
            }
        }
    }
    render(){
        return(
            <div key="status-two" className="statusWrapper" >
                {
                    this.state.updateDataBase ? <div className="indicatorWrapper whiteText"><div className="indicator" style={{backgroundColor:"#e58e26"}}></div>New data sources </div>:
                    <div className="indicatorWrapper  whiteText"><div className="indicator" style={{backgroundColor:"#38ada9"}}></div>No changes to DB </div>
                }
            </div>
        )
    }
}
export default UpdateBeachDataBase
