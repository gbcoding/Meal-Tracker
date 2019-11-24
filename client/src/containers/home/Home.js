import 'bootstrap/dist/css/bootstrap.css';
import './Home.css';
import React, { Component } from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
import { LogEntry } from '../../components/log_entry/LogEntry';
import LoadingIcon from '../../components/LoadingIcon';
import { View, ScrollView } from 'react-native';
import axios from 'axios';




export default class Home extends Component{

    constructor(props){
        super(props);
        this.state = {
            startDate: new Date(),
            error: null,
            isLoaded: false,
            items: [],
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            startDate: date,
        });
    }

    componentDidMount(){
        var today = new Date();
        var time = today.getFullYear() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getDate();
        const current_uid = this.props.UID;
        const current_Date = time;
        this.axiosGET('/home', current_uid, current_Date)
            .then(response => this.setState({ error: null, isLoaded: true, items: response.data.data}))
            .catch(err => console.log(err));
        
    }
    //Async Axios get request
    axiosGET = async(serverPath, user_id, current_date) => {
        try{
            const response = await axios.get(serverPath, {
                params: {
                    user_id: user_id,
                    current_date: current_date 
                }
            });
            return response;
        } catch (error) {
            console.log("here");
            console.error(error);
        }
    }

    //Render view of home page
    render(){

        const {items, isLoaded} = this.state;


        let displayScreen = "";
       
       
        console.log(isLoaded);

        if(isLoaded === true){
            if(items.length){
                displayScreen = (
                    items.map(item => {
                        
                        return (
                            <div>
                                <LogEntry item={item}/>
                            </div>
                        );     
                    })
                ); 
            }
            else{

                displayScreen = (
                    <span className="emptyMessage">No Entries Available</span>
                );
            }

        }
        else{
            displayScreen = (
                <View style={{ backgroundColor: "#4E4A4A", 
                    flexDirection: "row", 
                    display: "inline-block",  
                    justifyContent: "center",
                    marginTop: "50px",
                    marginLeft: "150px",
                    marginRight: "150px",
                    paddingTop: "15px", 
                    paddingBottom: "15px", 
                    borderRadius: "25px"
                    }}>   
                    <LoadingIcon />
                </View>
            );
        }

        
        return(
            <div className="home">
                <br></br>
                <div className="navy"></div>    
                <div className="view">
                    <h5 style={{textAlign: "center", fontWeight: "bold"}}>Today's Logs</h5>
                    <DatePicker className="datepicker"
                        selected={this.state.startDate}
                        onChange={this.handleChange}
                        readOnly={true}
                        dateFormat="MMMM d, yyyy"
                        //placeholderText="This is readOnly"
                    />
                    <br></br>
                    <br></br>
                    <div className="scroller">
                   
                        <View style={{ flexDirection: 'row', height: '100%'}}>
                        
                            <ScrollView>
                                {displayScreen} 
                            </ScrollView>  
                        
                        </View>
                        
                    </div>
                </div>
            </div>
        );
    }
}
