import React from 'react';
import '../theAppCss.css';
import {EU_BEACH_MONITOR} from '../apiUrls'


const  SurveyGuidelines = (props) =>{
    return (
        <div className="surveyGuide">
        <button onClick={props.seeGuide} id="closeSurveyGuide1" className="articleControlButton articleControlPos">
            Close
        </button>
            <div className="contentDiv">
            <h6 style={{marginBottom:"1vh"}}>Entering a survey</h6>

            <p>
                There are a few changes to the data entry methods. Please take note:
            </p>
            <ul>
                <li>The inventory is submitted in one list, you may consult this list prior to sending.</li>
                <li>The time to conduct the survey in minutes is requested.</li>
            </ul>

            <p>
                <strong>Inventory list:</strong> The data entry functions like a shopping cart. Fill out the top section once and select <i>Freeze location</i>.
                Then in the bottom section search and select the corresponding MLW categories and enter the quantity. A table will be generated with your choices. To remove an item from the
                inventory, click or press on the corresponding remove button in the table. The total will reflect the change.
            </p>
            </div>
            <div className="contentDiv">
            <p>
                <strong>Saving inventory to device:</strong> Push on the button "Save on device". It will be accesible with or without network service. To access stored surveys
                click on "Access stored survey". <strong>Once a survey is submitted to the server it is deleted from the device.</strong>

            </p>
            <p>
                <strong>Saving inventory to server:</strong> Push on the button "Post to server". If there is a network error or it can not submit you will be notified. The
                local copy is only destroyed if the server responds with a 200 or 201 response.
            </p>
            <p>
                <strong>Time:</strong> Please enter the time in minutes from when you started the survey to the time data entry was completed. If
                the collection and data entry were on different days then report the cumulative time of the two activities.
            </p>
            </div>
            <div className="contentDiv">
            <h6 style={{marginBottom:"1vh"}}>Best practices</h6>
            <p>
                <strong>Note on paper first:</strong> Do the inventory on paper first. Note the code, quantity and length at least. Once everything looks good,
                log in and enter the survey.
            </p>
            <p>
                <strong>Start on a landmark:</strong> GPS is good within 4 meters at best, so starting at the same spot everytime helps with consistency.
            </p>
            <p>
                <strong>Sort items on a grid:</strong> Get tarp and with colored duct tape make a grid on the tarp. When you sort the objects, put items from the same category
                in the same grid square. Then count the items in each square
            </p>
            </div>
            <div className="contentDiv">
            <p>
                <strong>Understand what you are doing:</strong> The data collection process is an integral part of the solution. Be consistent in the identification process,
                always refer to <a href={EU_BEACH_MONITOR}>The MLW guidelines</a> if you have any questions.
            </p>
            <p>
                <strong>Understand the statistics:</strong> when you understand how your observations relate to all the other observations you will have a better understanding of
                the process.
            </p>

            </div>
            <button onClick={props.seeGuide} id="closeSurveyGuide2" className="articleControlButton articleControlPos">
                Close
            </button>
        </div>
    )
}

export default  SurveyGuidelines
