import React from 'react'
import '../theAppCss.css'
import {MainMenu} from '../posedDivs'
import { ReactComponent as More} from '../images/plusSign.svg'
import { ReactComponent as Less } from '../images/minusSign.svg'

export function TheMainMenu(props){
    return(
        <MainMenu className="fix zHund topLeft marginT1 marginT6vh bxSize" pose={props.open ? "open":"closed"} menuWidth={props.menuWidth}>
            <div className="a-rowAuto">
                <div className="MenuBarContainer" style={{width:`${props.menuWidth}px`}}>
                    <button id="Introduction" className="nav-Button" onClick={props.startTrans} name="Intro">
                        Home
                    </button>
                    <button id="AboutUs" className="nav-Button" onClick={props.startTrans} name="AboutUs">
                        About
                    </button>
                    <button id="ReadArticles" className="nav-Button" onClick={props.startTrans} name="ReadArticles">
                        Docs
                    </button>
                    <button id="Projects" className="nav-Button" onClick={props.startTrans} name="Projects">
                        Projects
                    </button>
                    <button id="ViewLitterData" className="nav-Button" onClick={props.startTrans} name="ViewLitterData">
                        Litter Dash
                    </button>
                    {
                        props.loggedIn ? (
                            <>
                            <button id="CreateArticle" className="nav-Button" onClick={props.startTrans} key="CreateArticle" name="CreateArticle">
                                *Write article
                            </button>
                            <button id="EnterLitterSurvey" className="nav-Button" onClick={props.startTrans} key="EnterLitterSurvey" name="EnterLitterSurvey">
                                *Enter survey
                            </button>
                            </>
                        ):(
                            <>
                            <button id="CreateArticle" disabled={true} className="nav-Button-disabled" onClick={props.startTrans} key="CreateArticle" name="CreateArticle">
                                *Write article
                            </button>
                            <button id="EnterLitterSurvey" disabled={true} className="nav-Button-disabled" onClick={props.startTrans} key="EnterLitterSurvey" name="EnterLitterSurvey">
                                *Enter survey
                            </button>
                            </>
                        )
                    }
                    {
                        props.loggedIn ? (
                                <button id="logMeOut" className="nav-Button" onClick={props.logMeOut}>
                                    Log out
                                </button>
                            ):(
                                <button id="showLogIn" className="nav-Button" onClick={props.checkAuth} name="showLogIn">
                                    Log in
                                </button>
                            )
                    }

                </div>
                <div onClick={props.seeMenu} style={{height:"3rem", width:"3rem", backgroundColor:"#82ccdd", cursor:"pointer", borderRadius:"1.5rem", display:"flex", justifyContent:"center", alignItems:"center", border:"thin solid #808080",  alignSelf:"center", marginLeft:".25rem", boxSizing:"border-box", opacity:"0.6"}} >
                        {
                            props.open ? <Less height="48" width="48" fill="#ffffff" viewBox="0 0 24 24" />:
                            <More height="48" width="48" fill="#ffffff" viewBox="0 0 24 24" />
                        }
                </div>
            </div>
        </MainMenu>

    )
}
