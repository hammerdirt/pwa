import React from 'react'
import ReadArticles from './containers/readArticles'
import ViewLitterData from './containers/viewLitterData'
import CreateArticle from './containers/createArticle'
import AboutUs from './containers/aboutUs'
import Projects from './containers/projects'
import EnterLitterSurvey from './containers/enterLitterSurvey'
import Introduction from './containers/intro'
import {
    LIST_OF_BEACHES,
    LIST_OF_CODES,
    LIST_OF_USERS,
    WATER_BODY_CODE_TOTAlS,
    CITY_CODE_TOTALS,
    POST_CODE_TOTAlS,
    ARTICLE_SEARCH_TERMS,
    DAILY_TOTALS_PCS_M,
    LIST_OF_BEACHES_CATEGORY,
    LIST_OF_CATEGORIES
} from './apiUrls'
export const theComponents = (props) =>{
    return({
        "Intro":<Introduction commentsToState={props.returnComments} serverUp={props.serverUp} key="Intro"/>,
        "AboutUs":<AboutUs key="AboutUs"/>,
        "CreateArticle":<CreateArticle
            userData={props.userDataToShow}
            token={props.token}
            loggedIn={props.loggedIn}
            key="CreateArticle"
            />,
        "EnterLitterSurvey":<EnterLitterSurvey
            key="EnterLitterSurvey"
            token={props.token}
            loggedIn={props.loggedIn}
            mlwCodes={props.mlwCodes}
            mapData={props.mapData}
            userData={props.userDataToShow}
            userName={props.userName}
            />,
        "ReadArticles":<ReadArticles key="ReadArticles" loggedIn={props.loggedIn} serverUp={props.serverUp} comments={props.comments} token={props.token} userData={props.userDataToShow}/>,
        "ViewLitterData":<ViewLitterData
            key="ViewLitterData"
            mlwCodes={props.mlwCodes}
            mapData={props.mapData}
            windowWidth={props.windowWidth}
            windowHeight={props.windowHeight}/>,
        "Projects":<Projects key="Projects" />
    })
}
export const theDataStores = [
    {store:"codes", url:LIST_OF_CODES},
    {store:"users", url:LIST_OF_USERS},
    {store:"beaches", url:LIST_OF_BEACHES},
    {store:"dailyTotals", url:DAILY_TOTALS_PCS_M},
    {store:"waterBodyCodeTotals", url:WATER_BODY_CODE_TOTAlS},
    {store:"cityCodeTotals", url:CITY_CODE_TOTALS},
    {store:"postCodeTotals", url:POST_CODE_TOTAlS},
    {store:"articleSearchList", url:ARTICLE_SEARCH_TERMS},
    {store:"beachesByCategory", url:LIST_OF_BEACHES_CATEGORY},
    {store:"beachCategories", url:LIST_OF_CATEGORIES},
    {store:"articleSearchList", url:ARTICLE_SEARCH_TERMS}
]
export const hd_status = {
    "hd-assoc":"Hammerdirt associate",
    "hd-staff":"Hammerdirt staff",
    "hd-part":"Hammerdirt partner",
    "hd-dir":"Hammerdirt director",
    "spon":"Beach sponsor"
}
export const hd_roles = {
    "part-rel":"Partner relations",
    "dev-iot":"IoT developer",
    "dev-py":"Python developer",
    "dev-js":"JavaScript developer",
    "res-lit":"Literature review",
    "ed-cont":"Education and training",
    "ops-csr":"Environmental responsibility",
    "fin-accts":"Accounts payable/recievable",
    "ops-bus": "Business operations",
    "ops-dev":"Dev-ops",
    "spB":"Beach-sponsor",
    "inB":"Beach-litter inventory",
    "dev-quant":"Quant developer",
    "survey":"Environmental surveyor"
}
export const locationColors = [
    "rgba(235, 47, 6,1.0)",
    "rgba(246, 185, 59,1.0)",
    "rgba(106, 137, 204,1.0)",
    "rgba(120, 224, 143,1.0)"
]
export const storeKey = {
    'cities':'cityCodeTotals',
    'lakes':'waterBodyCodeTotals',
    'rivers':'waterBodyCodeTotals',
    'post':'postCodeTotals',
}
export const colors = [
    "#f8c291",
    "#e55039",
    "#eb2f06",
    "#b71540",
    "#6a89cc",
    "#4a69bd",
    "#1e3799",
    "#0c2461",
    "#82ccdd",
    "#60a3bc",
    "#3c6382",
    "#0a3d62",
    "#b8e994",
    "#78e08f",
    "#38ada9",
    "#079992",
    "#808080",
    "#333366",
    "#36454f",
    "#464646",
    "#fad390",
    "#f6b93b",
    "#fa983a",
    "#e58e26",
]
export const ARTICLE_CHOICES = [
    'Beach-litter',
    'Biology',
    'Botany',
    'Chemistry',
    'Docs',
    'Safety',
    'Survey protocols',
    'Membership',
    'Training plan',
    'App refactor',
    'API refactor',
    'Data Science',
    'Economics',
    'Environment',
    'Horticulture',
    'IoT',
    'JavaScript',
    'MySQL',
    'NoSQL',
    'Probability & statisitics',
    'Python',
    'Quantitative analysis',
    'R',
    'Git',
    'React',
    'Node',
    'Dev notes'
]
export const SkilsExperience = [{
    name: 'Technology',
    color:'#78e08f',
    data: [{
        name: 'Python: Django, Django-REST',
        description:"Development of dyanamic web apps and REST API using the Django and Django REST framework."
    }, {
        name: 'JavaScript, React, Highcharts, Leaflet, Popmotion, Node',
        description:"Creation of components that manage HTML, CSS and data output for functional dyanmic user interfaces."
    },{
        name:'HTML-CSS',
        description:'Development of user interfaces for responsive web apps.',
    },{
        name:'Python: Pandas, Scipy, ScikitLearn',
        description:'Our primary tool for data exploration and analysis used to develop methods for web applications',
    },{
        name:"Git",
        description:"Version management and collaboration tool for all our dev operations"
    },{
        name:"IndexedDB-NoSQL",
        description:'Management of data on client devices that use browsers',
    },{
        name:"MySQL",
        description:'Backend data mangement in conjuction with Django and Django REST',
    },{
        name:"Matplotlib",
        description:"Our primary tool for developing data visualisations and determining what data will be used in distributed apps"
    },{
        name:"Linux",
        description:"Our primary OS, we use Ubuntu a debian dsitribtution."
    },{
        name:"Python-Sockets",
        description:"For managing data between apps and IoT devices."
    },{
        name:"Python-mraa",
        description:"For mapping sensors and actuators to hardware"
    }
]
},{
    name:"Skills",
    color:'#4a69bd',
    data:[
        {
            name:"Protocol dev",
            description:"Developing protocols based on projects goals, safety and official guidelines."
        },{
            name:"Litterature review",
            description:"Summarizing and connecting different information sources to enable sensible fact based decisions."
        },{
            name:"Small group leadership",
            description:"Accompanying small groups in the data collection process and demonstrating protocols."
        },{
            name:"Data visualization",
            description:"Creation of publication or app ready interactive data visualizations using JavaScript and/or Python."
        },{
            name:"Field operations",
            description:"Ensuring that operations in the field are completed in a safe manner and according to agreed upon protocols."
        },{
            name:"Operations management",
            description:"Creating the conditions that allow the succesfull completion of all business operations."
        },{
            name:"Data analysis and engineering",
            description:"Getting the essential elements from data and enabling it to be shared across multiple channels."
        },{
            name:"Fabrication and prototyping",
            description:"Developing functional solutions that can serve as models for further development."
        },{
            name:"Bilingual",
            description:"We are a bilingual company French - English"
        },{
            name:"Research assistant",
            description:"Our wide range of interests and dedication make us excellent research partners."

        },{
            name:"Project management",
            description:"As a team, hammerdirt can manage the challenges of most projects.."
        }
    ]}
]

export const DISPOSITION = {
        "op": "opened",
        "ack":"Acknowledged",
        "inr":"In Review",
        "p":"Priority",
        "see":"See repo",
        "c":"Closed",
        "cln":"Clarification needed"
    }
export const SUBJECT = {
    "ui":"User interface",
    "dis":"Display",
    "ed":"Edit requested",
    "rf": "Check references",
    "mi":"More information",
    "ms": "Missing section",
    "d":"Data incomplete",
    "g":"This looks good",
    "fr":"Feature request",
    "pi":"Performance issue",
}
