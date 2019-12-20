import React, { PureComponent, lazy, Suspense } from 'react'
import '../theAppCss.css'
import { Beach_Data, Beach_Data_Version} from '../dataBaseVariables'
import { openDB } from 'idb/with-async-ittr.js'
import Loader from '../components/SpinComp'
import {SearchMenuOpen, SummaryPose, ModalPose} from '../posedDivs'
import {locationColors, storeKey} from '../variablesToEdit'
const LitterMap = lazy(()=>import('../components/Maps'))
const TopTenCompX = lazy(() => import('../components/TopTenCompX'))
const VisSummaryData = lazy(() => import('../components/VisSummaryData'))
const OverTimeComp = lazy(() => import('../components/OverTimeComp'))

class ViewLitterData extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            filteredValues:[],
            searchTerm:"",
            searchBy:"cities",
            searchCount:0,
            submitError:"",
            open:false,
            selected:[],
            beaches:[],
            locationCodeTotals:[],
            seeData:false,
            seeModal:false,
            seeTimeSeries:false,
            show:false,
            showMe:"",
            dailyTotalPcsM:[],
        }
        this.openDBGetByKey = this.openDBGetByKey.bind(this)
        this.filterFunction = this.filterFunction.bind(this)
        this.selectAValue = this.selectAValue.bind(this)
        this.searchForAValue = this.searchForAValue.bind(this)
        this.startASearch = this.startASearch.bind(this)
        this.makeSelection = this.makeSelection.bind(this)
        this.setSearchBy = this.setSearchBy.bind(this)
        this.seeMenu = this.seeMenu.bind(this)
        this.seeTimeSeries = this.seeTimeSeries.bind(this)
        this.getBeaches = this.getBeaches.bind(this)
        this.getDailyPcs_mTotals = this.getDailyPcs_mTotals.bind(this)
        this.getlocationCodeTotals = this.getlocationCodeTotals.bind(this)
        this.resetHandler = this.resetHandler.bind(this)
        this.setInitial = this.setInitial.bind(this)
        this.exploreData = this.exploreData.bind(this)
        this.openSummary = this.openSummary.bind(this)
        this.someMenuFunction = this.someMenuFunction.bind(this)
        this.aDoublesFunction = this.aDoublesFunction.bind(this)
        this.selectedRow = React.createRef()
    }
    componentDidMount () {
        this._isMounted = true
        console.log("mounting dashboard")
        this.setState({
            windowWidth:this.props.windowWidth,
            windowHeight:this.props.windowHeight,
        })
        this.setInitial()

    }
    componentDidUpdate(prevProps) {
        if (this.props.windowWidth !== prevProps.windowWidth) {
            this.setState({
                windowWidth:this.props.windowWidth,
                windowHeight:this.props.windowHeight,
            })
        }
    }
    componentWillUnmount(){
        this._isMounted = false
    }
    exploreData = (e) => {
        e.preventDefault()
        this.setState({
            seeData:!this.state.seeData,
            open:!this.state.open
        })
    }
    openDBGetByKey = async (storeName,term) => {
        console.log("Edge test -- calling openDb at view litter data")
        const db = await openDB(Beach_Data, Beach_Data_Version)
        const store = db.transaction(storeName).objectStore(storeName);
        const value = store.get(term)
        return value
    }
    getAllFromStore = async (storeName) => {
        const db = await openDB(Beach_Data, Beach_Data_Version)
        const all_data = db.getAll(storeName)
        return all_data
    }
    seeTimeSeries(e){
        e.preventDefault()
        this.setState({
            seeTimeSeries:!this.state.seeTimeSeries
        })
    }
    async setInitial(){
        let searchThis = await this.openDBGetByKey('beachCategories',this.state.searchBy)
        let theBeaches = await this.getAllFromStore('dailyTotals')

        this.setState({
            [this.state.searchBy]:searchThis.results,
            portrait:this.props.windowHeight > this.props.windowWidth ? true:false,
            theBeaches:theBeaches
        })
    }
    setSearchBy = async (e) => {
        e.preventDefault()
        console.log("set search by called")
        let mySearchBy = e.target.name
        console.log("calling indexedDB")
        let searchMe = await this.openDBGetByKey('beachCategories',mySearchBy)
        this.setState({
            searchBy:mySearchBy,
            [mySearchBy]:searchMe.results
        })
    }
    someMenuFunction(){
        if(this.state.seeData && this.state.open){
            return true
        }else if (!this.state.seeData){
            return false
        }
    }
    seeMenu = (e) => {
        e.preventDefault()
        const condition = this.state.open
        this.setState({
            open:!condition,
            seeData:!this.state.seeData
        })
    }
    openSummary(e){
        e.preventDefault()
        let val = e.target.value
        console.log("openSummarycalled")
        if (this.state.show){
            this.setState({
                showMe:"",
                show:false,

            })
        }else if(!this.state.show){
            this.setState({
                showMe:val,
                show:true,
            })
        }
        return val
    }
    async getDailyPcs_mTotals(listOfBeaches){
        console.log("Calling daily pcsM totals")
        const a_list = []
        listOfBeaches.beaches.forEach(beach => {
            let anObject = this.state.theBeaches.filter(obj => obj.location === beach)
            if (anObject[0]){
            a_list.push({
                    location:beach,
                    results:anObject[0].results,
                    color:listOfBeaches.color,
                    theRequest:listOfBeaches.requested
                })
            }else{
                const the_problem = `This is a problem: ${beach}, ViewLitterData: 159 !`
                console.log(the_problem)
            }

        })
        this.setState({
            dailyTotalPcsM:this.state.dailyTotalPcsM.concat(a_list)

        })
    }
    getlocationCodeTotals = async (thisSelection)=> {
        console.log("Calling location code totals")
        let myStore = storeKey[this.state.searchBy]
        let theCodeTotals = await this.openDBGetByKey(myStore, thisSelection.selection)
        return {
            theRequest:thisSelection.selection,
            color:thisSelection.color,
            codeTotals:theCodeTotals.results
        }
    }
    getBeaches = async (theRequest, theColor) => {
        console.log("Calling get beaches")
        let theBeaches = await this.openDBGetByKey('beachesByCategory', theRequest)
        return {beaches:theBeaches.beaches, color:theColor, requested:theRequest}
    }

    filterFunction(targetValue){
        let searchTerm = targetValue
        let filterTerms = this.state[this.state.searchBy]
        let filteredTerms =filterTerms.filter(place =>place.toLowerCase().toLowerCase().startsWith(searchTerm, 0))
        this.setState({filteredValues:filteredTerms})
    }

    searchForAValue(e){
        e.preventDefault()
        this.setState({searchTerm:e.target.value})
        this.filterFunction(e.target.value)
    }
    selectAValue(e){
        e.preventDefault()
        this.setState({searchTerm:e.target.value})
        this.setState({filteredValues:[]})
    }
    startASearch = (e) => {
        let aValue = e.target.value
        if (aValue) {
            this.setState({
                searchTerm:"",
                filteredValues:[],
            })
        }
    }
    resetHandler = (e) => {
        console.log("Reset Called")
        e.preventDefault()
        this.setState({
            searchCount:0,
            submitError:"",
            selected:[],
            beaches:[],
            dailyCodeTotals:[],
            locationCodeTotals:[],
            dailyTotalPcsM:[],
            show:false,
            showMe:"",
        })
    }
    aDoublesFunction(){
        if (this.state.selected.length > 0){
            const checkAgainst = []
            this.state.selected.forEach(obj => {checkAgainst.push(obj.selection)})
            if (checkAgainst.includes(this.state.searchTerm)){
                return false
            }else{
                return true
            }
        }else{
            return true
        }
    }
    makeSelection = async (e) => {
        console.log("Making a selection!")
        e.preventDefault()
        const countPlusOne = this.state.searchCount + 1
        const colorIndex = countPlusOne -1
        const checkForDouble = this.aDoublesFunction()
        if (!this.state.searchTerm){
            this.setState({submitError:"You forgot to enter a search term!"})
        }else if (countPlusOne > 4) {
            this.setState({submitError:"We set the limit to four."})
        }else if (!this.state[this.state.searchBy].includes(this.state.searchTerm)){
            this.setState({submitError:"Please select from the list."})
        }else if(!checkForDouble){
            this.setState({submitError:`You already selected ${this.state.searchTerm}.`})
        }
        else if (countPlusOne <= 4 && checkForDouble){
            console.log("making props")
            const selectionColor = locationColors[colorIndex]
            const theSelection = await this.getBeaches(this.state.searchTerm, selectionColor, this.state.searchBy)
            this.getDailyPcs_mTotals(theSelection)
            const thisSelection = {selection:this.state.searchTerm, color:selectionColor, searchBy:this.state.searchBy}
            const totalCodesToState = await this.getlocationCodeTotals(thisSelection)
            this.setState({
                searchCount:countPlusOne,
                submitError:"",
                selected:this.state.selected.concat(thisSelection),
                locationCodeTotals:this.state.locationCodeTotals.concat(totalCodesToState),
                beaches: [...this.state.beaches, theSelection],
                [this.state.searchTerm]:false
            })
        }
    }
    render(){
        const allocateContainers = (someState) => someState.map((obj, i) => {
            return (
                <div key={obj.selection} className="summaryWrapper">
                    <button key={obj.selection} onClick={this.openSummary} value={obj.selection} className="nav-Button">
                        {obj.selection}
                    </button>
                </div>
            )
        })
        return (
            <div className="dashBackground">
            <ModalPose pose={this.state.windowHeight > this.state.windowWidth ? "open":"closed"} className="aModalBackground  a-row100 contCenter">
                <div>
                    <h5 className="whiteText">This works best in landscape mode</h5>

                </div>
            </ModalPose>
            <div className="litterSearchMenu">
                <div onClick={this.seeMenu} className="exploreDataButton">
                    <div className="exploreDataLabel">Explore data</div>
                </div>
                <SearchMenuOpen className="litterSearchFormDiv" pose={this.someMenuFunction() ? 'open':'closed'}>
                    <div className="searchMenuWrapper" >
                        <div className="searchMenuText" >
                               First select either Rivers, Lakes, Cities or Postal code.
                        </div>
                        <div className="dashButtonBox">
                            <button onClick={this.setSearchBy} className="selector-Button" id="city" name="cities">
                                Cities
                            </button>
                            <button onClick={this.setSearchBy} className="selector-Button" id="lakes" name="lakes">
                                Lakes
                            </button>
                            <button onClick={this.setSearchBy} className="selector-Button" id="rivers" name="rivers">
                                Rivers
                            </button>
                            <button onClick={this.setSearchBy} className="selector-Button" id="post" name="post">
                                Postal
                            </button>
                        </div>
                    </div>
                    <div className="searchMenuError" >
                        {
                            this.state.submitError ? this.state.submitError: ""
                        }
                    </div>
                    <form onSubmit={this.makeSelection} className="searchMenuForm" >
                        <div className="searchFormHeader">
                            Searching {this.state.searchBy}:
                        </div>
                        <input className="dashInputText" type="text" placeholder="enter a search term" value={this.state.searchTerm} onClick={this.selectAValue} onChange={this.searchForAValue} onFocus={this.startASearch} />
                            {
                                this.state.filteredValues.length > 0 ? this.state.filteredValues.map(obj => {
                                    return (<input key={obj} className="dashSubmitButtonSafe" type="text" value={obj} onClick={this.selectAValue} readOnly/>)
                                } ):""
                            }
                        <button className="dashSubmitButtonSafe" type="submit" value="Submit">
                            Submit
                        </button>
                        <button className="dashSubmitButton"  type="button" onClick={this.resetHandler}>
                            Reset
                        </button>
                    </form>
                    <div  onClick={this.seeMenu} className="closeLitterSearchMenu" >
                       Close menu
                    </div>
                </SearchMenuOpen>
            </div>

                {/*<div className="mapContainer">*/}
                    <Suspense fallback={<Loader />}>
                        <LitterMap mapData={this.props.mapData} selected={this.state.selected} locationBeaches={this.state.beaches}/>
                    </Suspense>
                {/*</div>*/}
                <div ref={this.selectedRow} className="selectedRow">
                    {
                        this.state.selected ? allocateContainers(this.state.selected):<Loader />
                    }
                </div>
                <SummaryPose key={`summary-key`} className="aSummaryPose" pose={this.state.show ? 'open':'closed'}>
                    {
                        this.state.selected.filter(sel => sel.selection === this.state.showMe).map(obj =>{
                            return (
                                <div key={`summaryStats${obj.selection}`} className="dashSummaryContainer">
                                    <div key={`summaryStats${obj.selection}`} className="summaryContainerTable">
                                        <h5 style={{color:obj.color, fontWeight:"bold"}}>{obj.selection}</h5>
                                        <Suspense fallback={<Loader />}>
                                            <VisSummaryData selected={[obj]}  dailyTotals={this.state.dailyTotalPcsM} locationCodeTotals={this.state.locationCodeTotals.filter(item => item.theRequest === obj.selection)} />
                                        </Suspense>
                                        <Suspense fallback={<Loader />}>
                                            <TopTenCompX selected={[obj]} locationCodeTotals={this.state.locationCodeTotals.filter(item => item.theRequest === obj.selection)} mlwCodes={this.props.mlwCodes}/>
                                        </Suspense>
                                    </div>
                                    <div key={`summaryTime${obj.selected}`} className="summaryContainerChart">
                                        <Suspense fallback={<Loader />}>
                                            <OverTimeComp selected={this.state.selected} dailyTotals={this.state.dailyTotalPcsM} beaches={this.state.beaches} />
                                        </Suspense>
                                    </div>
                                </div>
                            )
                        })
                    }
                </SummaryPose>

            </div>
        )
    }
}
export default ViewLitterData;
