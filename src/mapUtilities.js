import L from 'leaflet'

// export const MAP_API_KEY = "pk.eyJ1IjoiaGFtbWVyZGlydCIsImEiOiJjanc1dG00OWkwYjBwNDRsMnY4MnJiNWc3In0.S5aieyLvesvFkYMmVgLNrA"

export const getLatLongPopUp = (beachList, beachData, color) =>  {
    const aDifferentList =[]
    beachList.forEach(beachName => {
        const aBeach = beachData.find(beach => beach.slug === beachName)
        const markerList = [aBeach.location, aBeach.latitude, aBeach.longitude, color, aBeach.city, aBeach.post]
        aDifferentList.push(markerList)
    })
    return aDifferentList
}
export const doNotRepeat = (firstBeachList, secondBeachList) =>{
    const newBeachList = firstBeachList.filter(beach => !secondBeachList.includes(beach))
    return (newBeachList)
}
export const makeBoundsArray = (theLists) => {
    const boundsArray = []
    for (var beach of theLists){
        boundsArray.push([beach[2], beach[3]])
    }
    const latLngs = boundsArray.map(position => {
        return L.latLng(position[0], position[1])
      })
    const bounds = L.latLngBounds(latLngs)
    return bounds
}
export const singlePointBounds = (theLists) => {
    const thePoint = theLists[0]
    var center = L.latLng(thePoint[2],thePoint[3]);
    var bounds = center.toBounds(1000);
    return bounds

}
export const markerHtmlStyles = (color) =>{
    return (`background-color: ${color};
        width: 2rem;
        height: 2rem;
        display: block;
        position: relative;
        border-radius: 1rem;
        border: 1px solid #FFFFFF`)
}
export const icon = (color) => {
    return (
        L.divIcon({
          className: "my-custom-pin",
          iconAnchor: [15,15],
          labelAnchor: [0, 0],
          popupAnchor: [0, 0],
          html: `<span style="${markerHtmlStyles(color)}" />`
      })
  )
}
