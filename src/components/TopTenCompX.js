import React, { PureComponent } from 'react';
import '../theAppCss.css';
import Loader from './SpinComp'
import {colors} from '../variablesToEdit'


class TopTenCompX extends PureComponent{
    constructor(props){
        super(props)
        this.state = {
            hello:["state is working"],
            codeColors:{G27:'#333366', all_other:"#464646"},
            barChartData:false,
        }
        this.handleSelectedProp = this.handleSelectedProp.bind(this)
        this.combineCodeTotals = this.combineCodeTotals.bind(this)
        this.objectBarChart = this.objectBarChart.bind(this)
        this.makeCodeColors = this.makeCodeColors.bind(this)
    }
    componentDidMount(){
        this.setState({
            currentSelected:this.props.selected,
            barChartData:this.objectBarChart()
        })
    }
    componentDidUpdate(prevProps) {
        if (this.props.selected !== prevProps.selected) {
            this.setState({
                currentSelected:this.props.selected,
                barChartData:this.objectBarChart()
            })
        }
    }
    handleSelectedProp = () => {
        const theReturn =[]
        this.props.selected.forEach(obj =>{
            const barChartBuilder = {requested:obj.selection, codeTotals:{}, beaches:[], color:obj.color}
            theReturn.push(barChartBuilder)
            })
        return theReturn
    }
    combineCodeTotals = () => {
        const barChartBuilders = this.handleSelectedProp()
        barChartBuilders.forEach(obj => {
            let combinedCodes = {}
            let totalObjects = 0
            let name = obj.requested
            this.props.locationCodeTotals.forEach(obj => {
                if(obj.theRequest === name){
                    obj.codeTotals.forEach(codeData => {
                        combinedCodes[codeData.code]=codeData.total
                        totalObjects += codeData.total
                    })
                }
            })
            obj['codeTotals'] = {...combinedCodes}
            obj['totalPieces'] = totalObjects
        })
        return barChartBuilders
    }
    makeCodeColors = (alist) => {
        const currentStateColors = this.state.codeColors
        let currentKeys = Object.keys(currentStateColors)
        let currentColors = Object.values(currentStateColors)
        let stateColors = colors.filter(color => !currentColors.includes(color))
        let usedColorsHere = []
        let usedCodesHere = []
        let addTheseToState = {}
        alist.forEach((code, i) => {
            let colorsToUse = stateColors.filter(color => !usedColorsHere.includes(color))
            let allUSedUpCodes = [...currentKeys, ...usedCodesHere ]
            if(!allUSedUpCodes.includes(code)){
                addTheseToState[code] = colorsToUse[i]
                usedCodesHere.push(code)
                usedColorsHere.push(colorsToUse[i])
            }
        })
        this.setState({
            codeColors: {
              ...this.state.codeColors,
              ...addTheseToState
          }
        })
        return { ...this.state.codeColors, ...addTheseToState}
    }
    objectBarChart = () =>{
        const theData = this.combineCodeTotals()
        const codeDefs = this.props.mlwCodes
        let myBarcharts =[]
        theData.forEach(obj => {
            let aTopTen =[]
            let theTopTenTotal = 0
            let codeTotals = obj.codeTotals
            let theKeys = Object.keys(codeTotals)
            const sortedKeys = theKeys.sort((current, next) => codeTotals[current] - codeTotals[next])
            const descending = sortedKeys.reverse()
            const topTenKeys = descending.slice(0,10)
            const colorsToUSe = this.makeCodeColors(topTenKeys)
            topTenKeys.forEach(key =>{
                const codeValue = codeTotals[key]
                const definition = codeDefs.filter(obj => obj.code === key)
                definition[0].total = codeValue
                theTopTenTotal = theTopTenTotal + codeValue
                aTopTen.push(definition[0])
            })
            const other = obj.totalPieces - theTopTenTotal
            const allOther = {code:'all_other', description:"All other objects", total:other}
            aTopTen.push(allOther)
            const makeValues = () => {
                console.log("Make values Top Ten Comp called")
                let theTopTen = []
                const inOrder = aTopTen
                inOrder.forEach(obj =>{
                    const name = obj.description
                    const data = obj.total
                    const aBar = {name:name, data:[data], color:colorsToUSe[obj.code]}
                    theTopTen.push(aBar)
                })
                return theTopTen
            }
            const myTopTen = [{requested:obj.requested, color:obj.color, topTen:makeValues(), topTenTotal:theTopTenTotal, locationTotal:obj.totalPieces}]
            myBarcharts.push(myTopTen)
        })
        return myBarcharts
    }
    render(){
        return (
            <div className="topTenCompWrapper aMarginT10">
                <span style={{fontSize:'12', color:"#ffffff", margin:".2rem 0rem .2rem 0rem", fontWeight:"bold"}}>Top ten objects:</span>
                {
                    this.state.barChartData ? this.state.barChartData.map((obj) =>
                            obj[0].topTen.map(results =>{
                                return(
                                    <div key={`${results.name}${results.data[0]}`} className="summaryTableRow">
                                        <div className="summaryTableLabels">
                                            {results.name}
                                        </div>
                                        <div className="summaryTableData" >
                                            {results.data[0]}
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
export default TopTenCompX;
