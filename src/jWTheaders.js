// import * as message from './httpMessages'

export const postHeaders = (theToken) => {
    console.log("making post headers")
    // console.log(theToken)
    const theJWT = theToken
    const authHeader = {"Authorization":`JWT ${theJWT}`}
    const appHeader = {"Content-Type": "application/json"}
    const headers = {...authHeader, ...appHeader}
    console.log(headers)
    return headers

}
export const makePostRequest = (putOrPost,url, headers, localdraft) => {
    // console.log(putOrPost, headers, localdraft)
    return (
        fetch(url, {
            method: putOrPost,
            headers: headers,
            body:localdraft
        })
    )
}
export const saveToServer = async (putOrPost,jsonData, url, theToken) =>{
    const serverPayLoad = JSON.stringify(jsonData)
    console.log("Saving to server")
    let the_response
    if(serverPayLoad){
        const headers = postHeaders(theToken)
        const makeRequest = makePostRequest(putOrPost,url, headers, serverPayLoad)
        the_response = await makeRequest.then(response => {return {ok:response.ok, status:response.status}})
    }else{
        the_response = {ok:"There is an application error", status:"Not sent"}
    }
        return the_response
}
export const thePayload = (theData, imageURL, userId) => {
    return {
        "title":theData.title,
        "subject":theData.subject,
        "article":theData.article,
        "references":theData.references,
        "summary":theData.summary,
        "image":imageURL,
        "owner":userId
        }
}
export function postPutArticle(params, aCallBack){
    let reader = new FileReader()
    var theUrl = params.slug ? params.url + params.slug: params.url
    reader.onload = function(){
        var dataURL = reader.result
        const aPayLoad = thePayload(params.theData, dataURL, params.userId)
        const theResponse = saveToServer(params.method,aPayLoad, theUrl, params.token)
        aCallBack(theResponse)
    }
    const myResponse = reader.readAsDataURL(params.imageFile)
    return myResponse

}
