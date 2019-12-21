import { PureComponent } from 'react'
import React from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import {icon, makeBoundsArray, singlePointBounds} from '../mapUtilities'
import '../theAppCss.css'
import {intersectionX} from '../helperMethods'


class LitterMap extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            isWorking:"Map state is working",
            mapMarkers:[],
            mapBounds:[],
        }
        this.noRepeats = this.noRepeats.bind(this)
        this.makeMapMarkers = this.makeMapMarkers.bind(this)
        this.useKeys = this.useKeys.bind(this)
        this.getSelectedBeaches = this.getSelectedBeaches.bind(this)
        this.mapBounds = this.mapBounds.bind(this)
    }
    componentDidMount () {
        let bounds = [["Montreux", "Le Pierrier", "46.43972700", "6.88896800", "rgba(183, 21, 64,0.5)"]]
        this.setState({mapBounds:singlePointBounds(bounds)})
    }
    componentDidUpdate(prevProps) {
        if (this.props.selected !== prevProps.selected) {
            this.setState({
                selected:this.props.selected
            }, this.mapBounds())
        }
    }
    useKeys(anObject){
        console.log(' Use Keys Maps called !!')
        let theRequested = []
        let beachState = {}
        anObject.forEach(obj => {
            console.log("edge test ---useKeys in the object forEach loop")
            theRequested.push(obj.requested);
            beachState[obj.requested] = obj.beaches;
        });
        let usedThese = []
        for(var i = 0; i < anObject.length; i++){
            console.log("edge test ---useKeys in the object for loop")
            let useThese = theRequested.filter(location => location !== anObject[i].requested)
            if(useThese.length > 0){
                console.log("edge test ---useKeys useThese > 0")
                let these = useThese.filter(aName => !usedThese.includes(aName))
                for(let j=0; j < these.length; j++){
                    console.log("edge test ---useKeys in these for loop")
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
        console.log("edge test --- making useTheseMarkers")
        anObject.forEach(obj => useTheseMarkers.push({requested:obj.requested, color:obj.color, beaches:beachState[obj.requested]}))
        console.log("edge test --- returning useTheseMarkers")
        return useTheseMarkers
    }
    getSelectedBeaches(){
        const theSelected = []
        this.props.selected.forEach(obj => {
            let FindMyBeaches = this.props.locationBeaches.filter(anObj => anObj.requested === obj.selection)
            theSelected.push({requested:obj.selection, color:obj.color, beaches:FindMyBeaches[0].beaches})
        })
        return theSelected
    }
    noRepeats = () => {
        const makeMarkers = this.getSelectedBeaches()
        let theMarkers = this.useKeys(makeMarkers)
        console.log("edge test --- returning theMarkers")
        return theMarkers
    }
    makeMapMarkers(){
        let theLocations = this.noRepeats()
        let myMarkers = []
        console.log("edge test --making map markers")
        theLocations.forEach(location => {
            console.log("edge test -- in theLocation for each loop")
            location.beaches.forEach(beach => {
                console.log("edge test ---makeMapMarkers location.beaches forEach loop")
                let beachData = this.props.mapData.filter(obj => obj.slug === beach)
                console.log("edge test ---makeMapMarkers got the beach data")
                let newColor = location.color.replace(/[\d\.]+\)$/g, '0.5)')
                let markerData = [
                    location.requested,
                    beachData[0].location,
                    beachData[0].latitude,
                    beachData[0].longitude,
                    newColor
                ]
                myMarkers.push(markerData)
            })
        })
        console.log("myMarkers are done")
        this.setState({mapMarkers:myMarkers})
        return myMarkers
    }
    mapBounds(){
        console.log(" Map bounds called ")
        const mapMarkers = this.makeMapMarkers()
        if (mapMarkers.length > 1) {
            console.log("edge test --- calling makeMapBoundsArray")
            let bounds = makeBoundsArray(mapMarkers)
            this.setState({mapBounds:bounds})
            return
        }else if (mapMarkers.length === 1){
            console.log("edge test --- calling singlePointBoundsArray")
            let bounds = singlePointBounds(mapMarkers)
            this.setState({mapBounds:bounds})
        }else {
            console.log("edge test --- setting singlePointBoundsArray")
            let bounds = singlePointBounds([["Montreux", "Le Pierrier", "46.43972700", "6.88896800", "rgba(183, 21, 64,0.5)"]])
            this.setState({mapBounds:bounds})
        }
    }
    render(){
        console.log("rendering maps")
        // console.log(this.props.mapData)
        const myMapBounds = ()=> {
            if (this.state.mapBounds.length === 0){
                let myMapBounds = singlePointBounds([["Montreux", "Le Pierrier", "46.43972700", "6.88896800", "rgba(183, 21, 64,0.5)"]])
                return myMapBounds
            }else{
                return this.state.mapBounds
            }
        }
        const MAP_API_KEY =`${process.env.REACT_APP_MAP_API_KEY}`
        return(
            <div className="mapContainer">
                <Map zoom={this.state.zoom}
                    style={{
                        width:"100vw",
                        minWidth:"1300px",
                        height:"100vh",
                        minHeight:"800px",
                        zIndex:"0"
                    }}
                    zoomControl={false}
                    bounds={myMapBounds()}
                    boundsOptions={{
                        padding: [30,30]
                    }}
                >
                    <TileLayer
                      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url={`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${MAP_API_KEY}`}
                      id='mapbox.streets'
                      accessToken={MAP_API_KEY}
                    />
                    {
                        this.state.mapMarkers.map(aBeach =>{
                            return (
                                <Marker key={`${aBeach[1]}${aBeach[2]}`} position={[aBeach[2], aBeach[3]]} icon={icon(aBeach[4])}>
                                  <Popup>
                                    Requested: {aBeach[0]} <br/>
                                    Beach name: {aBeach[1]} <br/>
                                  </Popup>
                                </Marker>
                            )
                        })
                    }
                </Map>
            </div>
        )
    }
}

export default LitterMap
