import React, {Component} from 'react'
import '../theAppCss.css'



class SkillsTable extends Component{
    constructor(props){
        super(props)
        this.state ={
        }
    }
    componentDidMount(){
        this._isMounted = true
    }
    componentWillUnmount(){
        this._isMounted = false
    }
    render(){
        return(
            <div className="skillTableDiv">
                <div className="skillTableHeaderRow">
                {
                    this.props.header
                }
                </div>
                {
                    this.props.tools.map(obj => {
                        return(
                            <div key={obj.name} className="skillTableRow">
                                <div className="skillTableCellLabel">
                                    {obj.name}
                                </div>
                                <div className="skillTableCellData">
                                    {obj.description}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default SkillsTable
