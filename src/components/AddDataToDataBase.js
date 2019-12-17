import { Component } from 'react'
import React from 'react'
import { openDB } from 'idb';
import { Beach_Data, Beach_Data_Version} from '../dataBaseVariables'
import {retrieveData} from '../helperMethods'
import '../theAppCss.css'

class GetNewData extends Component {
    constructor(props){
        super(props)
        this.state = {
            answers:false,
        }
        this.getAndAddData = this.getAndAddData.bind(this)
        this.addDataToDataBase = this.addDataToDataBase.bind(this)
        this.accumulator = this.accumulator.bind(this)
        this.addDateOfUpdate = this.addDateOfUpdate.bind(this)
    }
    async componentDidMount() {
        console.log("mounting add data")
        this._isMounted = true
        const lastUpdate = await retrieveData('lastUpdate',Beach_Data, Beach_Data_Version, openDB )
        if(lastUpdate.length > 0 && this._isMounted){
            const aString = `Updated: ${lastUpdate[0].date}`
            this.setState({
                lastUpdate:aString,
            }, this.props.isThereData(true))
        }else if(this._isMounted){
            this.setState({
                lastUpdate:"No data",
            }, this.props.isThereData(false))
        }

    }
    componentWillUnmount(){
        console.log("unmounting add data")
        this._isMounted = false
    }
    addDataToDataBase = async (data, store, dataBase) =>{
        const aDb = indexedDB.open(dataBase)
        var transaction, theStore
        aDb.onsuccess = event => {
            let db = event.target.result
            transaction = db.transaction([store], "readwrite")
            theStore = transaction.objectStore(store)
            theStore.clear()
            transaction.onerror = function(event) {
            };
            transaction = db.transaction([store], "readwrite")
            theStore = transaction.objectStore(store)
            data.forEach(beach => {
                const added_data = theStore.add(beach)
                added_data.onerror = function(event){
                }
            })
        }
    }
    accumulator = (reply) => {
        let old
        if (this.state.answers){
            old = this.state.answers
        }else{
            old = []
        }
        if (!old.includes(reply)){
            old.push(reply)
            this.setState({answers:old})
        }
    }
    getAndAddData = () =>{
        const dataStore = this.props.dataStores
        const dataBase = this.props.dataBase
        console.log("fetching data from server")
        dataStore.forEach(obj =>{
            fetch(obj.url)
                .then(response =>  response.json()
                .then(data => ({status: response.status, body: data})))
                .then(theData => {
                    this.addDataToDataBase(theData.body, obj.store, dataBase)
                    this.accumulator({store:obj.store, status:theData.status})
                })
        })
        this.addDateOfUpdate(dataBase)
    }
    addDateOfUpdate(dataBase){
        const now = new Date().toISOString().split('T')[0]
        this.addDataToDataBase([{date:now, lastUpdate:now}], "lastUpdate", dataBase)
        this.setState({
            lastUpdate:`Updated: ${now}`
        })
    }
    render(){
        let trouble = () => {
            let what_i_want
            if (this.state.answers){
                let trbl = this.state.answers.filter(obj => obj.status !== 200)
                if (trbl.length > 0){
                    what_i_want = {color:"#eb2f06" , data: trbl}
                }else {
                    what_i_want = {color:"#38ada9", data:this.state.lastUpdate}
                }
            }else if(this.state.lastUpdate === "No data"){
                what_i_want = {color:"#eb2f06", data:this.state.lastUpdate}
            }else{
                what_i_want = {color:"#38ada9", data:this.state.lastUpdate}
            }
         return what_i_want
        }
        const my_trouble = trouble()
        return(
            <>
                {
                    my_trouble ?
                        <div key={`GettingNewData`} className="indicatorButton jStart truncate " onClick={this.getAndAddData} >
                            <div className="indicator " style={{backgroundColor:my_trouble.color}}></div>
                            {my_trouble.data}
                        </div>:<div style={{width:"10%", height:"10vh"}}>Nothing</div>
                }
            </>
        )
    }
}

export default GetNewData
