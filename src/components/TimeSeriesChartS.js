import React, { Component } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import '../theAppCss.css'

class TimeSeriesChartS extends Component {
    constructor(props){
        super(props)
        this.state = {
            requested:"",
            values:[],
        }
        this.options = this.options.bind(this)
    }
    componentDidMount() {
        this.setState({
            data:this.props.data,
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevProps.data) {
            this.setState({
                data:this.props.data,
            })
        }
    }
    componentWillUnmount(){
    }
    options = () => {
        return ({
            chart: {
                type: 'scatter',
                animation:false,
                backgroundColor:null,
                plotBorderWidth:0,
                spacingBottom:0,
                spacingTop:0,
                zoomType: 'x',
                margin: [100,20,80,80],
                style: {
                  fontFamily: 'sans-serif',
              },

            },
            title: {
                enabled:true,
                text: "Survey totals by date",
                align:"left",
                style: {
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize:"1.25rem",
                }
            },
            legend: {
                enbaled:true,
                align: 'left',
                verticalAlign: 'top',
                layout: 'horizontal',
                itemDistatnce:20,
                margin:50,
                floating:false,
                itemStyle:{
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize:"1rem",
                    textOverflow: "ellipsis"
                }
            },
            xAxis: {
                visible:true,
                type: 'datetime',
                tickInterval:3600*1000*24*28*2,
                labels: {
                  style: {
                    color:'#ffffff'
                  }
                },
                gridLineColor:'#ffffff',
                gridLineDashStyle:'longdash',
                gridLineWidth:1,
                offset:10,
                dateTimeLabelFormats: {
                  month: '%b - %Y',
                },
            },
            yAxis: {
                title: {
                    align: 'low',
                    offset: 50,
                    text: 'Pieces of trash per meter',
                    style:{
                      fontSize: '14px',
                      color:'#ffffff',
                    },
                },
                offset:10,
                gridLineColor:'#ffffff',
                labels: {
                  style: {
                    color:'#ffffff',
                    fontSize:'1rem',
                  }
                },
                tickInterval: 8,
                min: 0,
            },
            plotOptions: {

                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
            },
            tooltip: {
                formatter: function() {
                    return  this.point.name + ': <br/>' +
                        Highcharts.dateFormat('%e - %b', new Date(this.x))
                    + ' , ' + this.y + 'pcs/m';
                }
            },
            series:this.props.data,
        })
    }
    render() {
        return (
            <div className="timeSerisDisplay">
                <HighchartsReact
                    key="TimeSeriesChart"
                    highcharts={Highcharts}
                    options={this.options()}
                />
            </div>
        )
    }
}
export default TimeSeriesChartS;
