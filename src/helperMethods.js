import { Beach_Data, Beach_Data_Version} from './dataBaseVariables'
import {SERVER_CHECK} from './apiUrls'

export const getTheUserName = (arr,value) => {
    for (var i=0, iLen=arr.length; i<iLen; i++) {
        if (arr[i].id === value) return arr[i];
    }
}
export const  a_set = () =>{
    if (this.state.articles){
        let a_list = this.state.articles.map(obj => obj.subject)
        let a_set = new Set(a_list)
        return [...a_set]
    }
}
export const retrieveData = async (storeName,Beach_Data, Beach_Data_Version, openDB ) => {
    const db = await openDB(Beach_Data, Beach_Data_Version)
    if(db.objectStoreNames.contains(storeName)){
        const theData = await db.getAll(storeName)
        return theData
    }else{
        return [{date:"Its been awhile"}]

    }

}
export function useIndexedCursorGet(Beach_Data, Beach_Data_Version, storeName, stateName, eventListener){
    const dbRequest = window.indexedDB.open(Beach_Data, Beach_Data_Version)
    dbRequest.onsuccess = function(event){
        console.log("The db is open")
        const db = dbRequest.result
        const tx = db.transaction(storeName, 'readonly')
        const codes = []
        tx.objectStore(storeName).openCursor().onsuccess = function(event){
            var cursor = event.target.result
            if(cursor){
                // console.log(cursor)
                codes.push(cursor.value)
                cursor.continue();
            }else{

            }
        }
        tx.objectStore(storeName).openCursor().onerror = function(event){
            console.log(event)
        }
        tx.addEventListener('error', () => {
            eventListener(false, "not good")
        })
        tx.addEventListener('complete', () => {
            eventListener(stateName, codes)
        })
    }

}
export const postDataToStore = async (storeName,Beach_Data, Beach_Data_Version, openDB, someData )=>{
    console.log("posting data to store")
    const db = await openDB(Beach_Data, Beach_Data_Version)
    const result = db.put(storeName,someData)
    return result
}

export const clearStore = async(storeName,Beach_Data, Beach_Data_Version, openDB ) =>{
    const db = await openDB(Beach_Data, Beach_Data_Version)
    console.log("clear store called")
    db.clear(storeName)
}

export const clearItem = async(storeName,key, Beach_Data, Beach_Data_Version, openDB ) => {
    const db = await openDB(Beach_Data, Beach_Data_Version)
    const tx = db.transaction(storeName, 'readwrite')
    tx.store.delete(key)
}

export function checkForDb(){
    const indexDB = window.indexedDB
    console.log("checking for db")
    if (!indexDB){
        return false
    }else {
        return true
    }
}
export const setConnection = (aBool) => {
    return aBool
}
export const checkTheConnection = (connection) => {
    if(!connection){
        fetch(SERVER_CHECK)
            .then(response => response.status).then(myResponse => {
                if(myResponse === 200){
                    setConnection(true)
                }
                else {
                    setConnection(false)
                }
            })
    }
}
export const isUpGradeNeeded = async (isDbOpen, upgradeNeeded, upgradeError) => {
    var request = window.indexedDB.open( Beach_Data, Beach_Data_Version)

    request.onsuccess = function(event){
        isDbOpen(true);
    };
    request.onerror = function(event){
        isDbOpen(false);
    }
    request.onupgradeneeded = function(event){
        upgradeNeeded(true)
        console.log("from connection functions the upgrade is needed")
        const db = request.result;
        db.onerror = function(errorEvent){
            upgradeError(true)
        }
    }
}
export function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}
export const thousandsSeparators = (num) => {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return num_parts.join(".")
}
export const intersectionX = (setA, setB) => {
    console.log("this intersectionX")
    var _intersection = new Set();
    for (var elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    if(_intersection.size === 0){
        return false
    }else{
        return  [..._intersection.values()]
    }
}
