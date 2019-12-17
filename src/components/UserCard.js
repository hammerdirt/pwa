import React, { PureComponent } from 'react';
import '../theAppCss.css';
import dev_guy225 from '../images/Dev_guy225.jpg'
import anonymousUser from '../images/AnonymousUser.jpeg'
import maleAnonymous from '../images/MaleAnonymous.png'
import {hd_roles} from '../variablesToEdit'


class UserCard extends PureComponent {
    // constructor(props){
    //     super(props)
    // }
    componentDidMount () {
        console.log("mounting people cards")
    }
    render(){
        const image_object ={
            roger:dev_guy225,
            the_admin:maleAnonymous,
            shannon:anonymousUser,
            gary:maleAnonymous,
            kristen:anonymousUser
        }
        const current_users = this.props.userData.filter(obj => obj.username !== "AnonymousUser" )
        const my_image = (key) => {
            if (image_object[key]){
                return image_object[key]
            }else{
                return anonymousUser
            }
        }
        return (
            <div className="flx a-row100P jCenter aStretch">
            {
                current_users.map(obj => {
                    return (
                        <div className="flx flexShrink25 wMin360 a-columnNoWrap jCenter" style={{margin:"2vh 0"}} key={obj.username}>
                            <div className="userCardTitle">
                                <span className="emphasis">{obj.first_name} {obj.last_name} </span>
                            </div>
                            <img className="userCardImage" src={my_image(obj.username)} alt="The person of interest"/>
                            <div className="userCardSummary">
                                Job description: {obj.about}
                            </div>
                            <div className="userCardTitle">
                                <span className="emphasis">{hd_roles[obj.position]}</span>
                            </div>
                            <div className="userCardTitle">
                                Date joined: {obj.date_joined.slice(0, 10)}
                            </div>
                            <div className="userCardTitle">
                                twitter: {obj.user_twitter}
                            </div>
                        </div>

                    )
                })
            }
            </div>
        );
  }
}
export default  UserCard;
