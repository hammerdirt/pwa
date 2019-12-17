import React, { PureComponent } from 'react';
import '../theAppCss.css';
import {max, min, sumSimple, mean, median } from 'simple-statistics'
import Loader from './SpinComp'
import {thousandsSeparators} from '../helperMethods'


class VisSummaryData extends PureComponent{
    constructor(props){
        super(props)
        this.state = {
            waiting:true,
            currentSelected:false,
            selected:[]

        }
        this.makeTableData = this.makeTableData.bind(this)
        this.handleSelectedProp = this.handleSelectedProp.bind(this)
        this.makeTableStats = this.makeTableStats.bind(this)
    }
    componentDidMount(){
        console.log("mounting vis summary")
        if (this.props.selected.length > 0){
            this.setState({
                selected:this.props.selected,
                currentSelected:this.makeTableStats()
            })
        }
    }
    componentDidUpdate(prevProps) {
        console.log("updating vis summary")
        if (this.props.selected !== prevProps.selected) {
            if(this.props.selected.length > 0){
                console.log("selected > 0")
                this.setState({
                    selected:this.props.selected,
                    currentSelected:this.makeTableStats()
                })
            }else{
                console.log("selected !> zero")
                this.setState({
                    waiting:true,
                    currentSelected:false,
                })

            }

        }
    }
    setLoadingToFalse(){
        this.setState({
            loading:false
        })
    }
    handleSelectedProp = () => {
        const theReturn ={}
        if(this.props.selected){
            this.props.selected.forEach(obj =>{
                theReturn[obj.selection]={dailyPiecesMeter:[], piecesTotal:[], beaches:[], color:obj.color}
            })
        }
        return theReturn
    }
    makeTableData = () =>{
        const theSelected = this.handleSelectedProp()
        this.props.dailyTotals.forEach(obj => {
            if (obj.results && theSelected[obj.theRequest] ) {
                const dailyValues = obj.results.map(arr => arr[1])
                const oldMe = theSelected[obj.theRequest]['dailyPiecesMeter']
                theSelected[obj.theRequest]['dailyPiecesMeter'] = [...dailyValues, ...oldMe]
                theSelected[obj.theRequest]['beaches'].push(obj.location)
            }
        })
        this.props.locationCodeTotals.forEach(obj => {
            let theCodeTotals = []
            obj.codeTotals.forEach(codeData => theCodeTotals.push(codeData.total))
            let theRequest = obj.theRequest
            theSelected[theRequest]['piecesTotal'] = theCodeTotals
        })
        return theSelected
    }
    makeTableStats(){
        const theData = this.makeTableData()
        const theLocation = Object.keys(theData)
        const toDisplay = []
        theLocation.forEach(selection => {
            const useMe = theData[selection]
            const dailyValuesSorted = useMe.dailyPiecesMeter.sort()
            const tableData = {
                selected:selection,
                color:useMe.color,
                count:useMe.dailyPiecesMeter.length,
                max:max(dailyValuesSorted),
                min:min(dailyValuesSorted),
                average:mean(dailyValuesSorted),
                median:median(dailyValuesSorted),
                total:sumSimple(useMe.piecesTotal)
            }
            toDisplay.push(tableData)
        })
        this.setState({
            waiting:false
        })

        return toDisplay

    }
    render(){
        console.log("Rendering vis summary data")
        return (
                    <div className="topTenCompWrapper aMarginT10">
                    <span style={{fontSize:'12', color:"#ffffff", margin:".2rem 0rem .2rem 0rem", fontWeight:"bold"}}>Summary:</span>
                        {
                            this.state.currentSelected ? (
                                this.state.currentSelected.map((obj,i) =>{
                                    return (
                                        <div key={`${obj.color}${obj.selected}${i}`} style={{display:"flex", width:"100%", flexFlow:"column nowrap"}}>
                                            <div key={`${obj.count}${obj.selected}Count`} className="summaryTableRow">
                                                <div className="summaryTableLabels">
                                                    N<sup>o</sup> of samples:
                                                </div>
                                                <div  className="summaryTableData">
                                                    {obj.count}
                                                </div>
                                            </div>
                                            <div key={`${obj.max}${obj.selected}Max`} className="summaryTableRow">
                                                <div className="summaryTableLabels">
                                                    Max pieces/meter
                                                </div>
                                                <div  className="summaryTableData">
                                                    {obj.max}
                                                </div>
                                            </div>
                                            <div  key={`${obj.min}${obj.selected}Min`} className="summaryTableRow">
                                                <div className="summaryTableLabels">
                                                    Min pieces/meter
                                                </div>
                                                <div  className="summaryTableData">
                                                    {obj.min}
                                                </div>
                                            </div>
                                            <div key={`${obj.average}${obj.selected}Mean`} className="summaryTableRow">
                                                <div className="summaryTableLabels">
                                                    Average pieces/meter
                                                </div>
                                                <div   className="summaryTableData">
                                                    {obj.average.toFixed(2)}
                                                </div>
                                            </div>
                                            <div key={`${obj.median}${obj.selected}Median`} className="summaryTableRow">
                                                <div className="summaryTableLabels">
                                                    Median pieces/meter
                                                </div>
                                                <div   className="summaryTableData">
                                                    {obj.median.toFixed(2)}
                                                </div>
                                            </div>
                                            <div key={`${obj.total}${obj.selected}Total`} className="summaryTableRow">
                                                <div className="summaryTableLabels">
                                                    Total pieces removed
                                                </div>
                                                <div   className="summaryTableData">
                                                    {thousandsSeparators(obj.total)}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ):<Loader />
                        }

                    </div>
                )
            }
}
export default VisSummaryData;
