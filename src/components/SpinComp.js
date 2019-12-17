import React, { Component } from 'react';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
export default class ALoader extends Component {
  //other logic
    render() {
     return(
      <Loader
         type="Puff"
         color="#00BFFF"
         height={100}
         width={100}
         // timeout={3000} //3 secs

      />
     );
    }
 }
