import React, { PureComponent } from 'react';
import '../theAppCss.css'
import TimeSeriesChartS from './TimeSeriesChartS'
import {intersectionX} from '../helperMethods'


class OverTimeComp extends PureComponent{
    constructor(props){
        super(props)
        this.state = {
            data:false,
            waiting:true,
        }
        this.timeSeriesChart = this.timeSeriesChart.bind(this)
        this.getSelectedBeaches = this.getSelectedBeaches.bind(this)
        // this.intersectionX = this.intersectionX.bind(this)
        this.noRepeats = this.noRepeats.bind(this)
        this.useKeys = this.useKeys.bind(this)
    }
    componentDidMount(){
        this.setState({
            currentSelected:this.props.selected,
            dailyTotals:this.props.dailyTotals,
            data:this.timeSeriesChart()
        })
    }
    componentDidUpdate(prevProps) {
        if (this.props.selected !== prevProps.selected) {
            this.setState({
                currentSelected:this.props.selected,
                data:this.timeSeriesChart()
            })
        }
    }
    useKeys(anObject){
        let theRequested = []
        anObject.forEach(obj => theRequested.push(obj.requested));
        let beachState = {}
        anObject.forEach(obj => beachState[obj.requested] = obj.beaches)
        let usedThese = []
        for(var i = 0; i < anObject.length; i++){
            let useThese = theRequested.filter(location => location !== anObject[i].requested)
            if(useThese.length > 0){
                let these = useThese.filter(aName => !usedThese.includes(aName))
                for(let j=0; j < these.length; j++){
                    let compareAgainst = anObject.filter(obj => obj.requested === these[j])
                    let anIntersection = intersectionX(new Set(anObject[i].beaches), new Set(compareAgainst[0].beaches))
                    if(anIntersection){
                        if (beachState[anObject[i].requested].length > beachState[compareAgainst[0].requested].length){
                            beachState[anObject[i].requested]= beachState[anObject[i].requested].filter(aLocation => !anIntersection.includes(aLocation))
                        }else{
                            beachState[compareAgainst[0].requested] = beachState[compareAgainst[0].requested].filter(aLocation => !anIntersection.includes(aLocation))
                        }
                    }
                    usedThese.push(anObject[i].requested)
                }
            }else{
                console.log("there is noting to compare to")
            }
        }
        let useTheseMarkers = []
        anObject.forEach(obj => useTheseMarkers.push({requested:obj.requested, color:obj.color, beaches:beachState[obj.requested]}))
        return useTheseMarkers
    }
    getSelectedBeaches(){
        this.setState({waiting:true})
        const theSelected = []
        this.props.selected.forEach(obj => {
            let FindMyBeaches = this.props.beaches.filter(anObj => anObj.requested === obj.selection)
            theSelected.push({requested:obj.selection, color:obj.color, beaches:FindMyBeaches[0].beaches})
        })
        return theSelected
    }
    noRepeats(){
        const makeMarkers = this.getSelectedBeaches()
        return this.useKeys(makeMarkers)
    }
    timeSeriesChart(){
        let data = this.props.dailyTotals
        let myMarkers = this.noRepeats()
        let newData = []
        myMarkers.forEach(obj => {
            let the_data = []
            let newColor
            // console.log(obj)
            obj.beaches.forEach(aBeach => {
                let theseResults = data.filter(thisBeach => thisBeach.location === aBeach)
                // console.log(theseResults)
                // newColor = obj.color
                newColor = obj.color.replace(/[\d\.]+\)$/g, '0.8)')
                if(theseResults[0]){
                    theseResults[0].results.forEach(result => {
                        // console.log(result)
                        let newResult = {name:aBeach, x: Date.parse(result[0]), y:result[1]}
                        the_data.push(newResult)

                    })
                }else{
                    const the_problem = `This is a problem: ${aBeach}, OverTimeComp: 99 !`
                    console.log(the_problem)
                }

            })
            newData.push({name:obj.requested, marker:{fillColor:newColor, lineColor:"#ffffff",lineWidth:1, symbol:"circle", radius:6}, data:the_data})
        })
        this.setState({
            waiting:false
        })
        return newData
    }
    render(){
        console.log("rendering time series")
        return (
            <TimeSeriesChartS data={this.state.data} selected={this.state.currentSelected} />
        )
    }
}
export default OverTimeComp;
