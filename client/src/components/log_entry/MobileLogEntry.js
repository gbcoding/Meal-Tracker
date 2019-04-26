import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Row, Col, ButtonGroup } from 'reactstrap';
import { Form, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import './MobileLogEntry.css';

import flag_true from '../../images/flag_true.png';
import flag_false from '../../images/flag_false.png';

export default class MobileEntry extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null,
            show: false,
            width: window.innerHeight, 
            height: window.innerWidth,
            isItemEditing: false
        };
    }

    editItemToggle = () => {
        const { isItemEditing } = this.state;
        this.setState( { isItemEditing: !isItemEditing });  
    }

    showToggle = () => {
        const { show } = this.state;
        this.setState( { show: !show } );
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
    
    const item = this.props.item;    
    const isEditing = this.props.isEditing;


    let EditingButton = "";
    let EntryDisplay = "";

    if(isEditing) {        
        EntryDisplay = (
            <div className="Entry" key={item.log_id}>
                <MobileLogEdit item={item} isItemEditing={this.state.isItemEditing} updateItem={this.props.updateItem} deleteItem={this.props.deleteItem} editItemToggle={this.editItemToggle}/>
            </div>
        );
    }
    else {
        EntryDisplay = (
            <View style={{ flexDirection: 'row', alignSelf: 'stretch'}}>
            <div className="Entry" key={item.log_id}>
                <Row>
                    <Col className="Name" xs="3">
                        <Text  style={{fontSize: "3vw", fontWeight: "bold"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                            {item.food_consumed}
                        </Text>
                    </Col>
                    <Col className="Flag" xs="2">
                        <img src={item.issue_flag=="1" ? flag_true : flag_false}/>
                    </Col>
                    <Col className="Date" xs="2">
                        <Text  style={{fontSize: "3vw", fontWeight: "bold"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                            {item.date.substring(0,10)}
                        </Text>
                    </Col>
                    {/*<Col className="Time" xs="2">
                        <Text  style={{fontSize: "3vw", fontWeight: "bold"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                            {item.time}
                        </Text>  
                    </Col>*/}
                    <Col xs="3">
                        <Button className="bttn" color="primary" onClick={ this.showToggle } block>
                            {this.state.show ? "Hide Details" : "Show Details"}
                        </Button>
                    </Col>
                </Row>
    
                { this.state.show && <MobileLogDetail item={item} />}
       
            </div>
            </View>
        );
    }
    return(    
        <View>
            {EntryDisplay}    
        </View>
        );
    }
}

class MobileLogDetail extends Component {
    
    constructor(props) {
        super(props);

    }

    render(){
        const item = this.props.item;

        return(
            <div className="detail">
                    <hr/>
                    <Row>
                        <Col>
                            <Text style={{fontSize: "3vw"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                                Type: {item.meal_type}
                            </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={{fontSize: "3vw"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                                Duration: {item.duration} 
                            </Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={{fontSize: "3vw"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling>
                                Severity: {item.severity}
                            </Text>
                        </Col> 
                    </Row>
                    <Row>
                        <Col>
                            <Text style={{fontSize: "3vw"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling>
                                Time: {item.time}
                            </Text> 
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Text style={{fontSize: "3vw"}} adjustsFontSizeToFit minimumFontScale={.5} allowFontScaling>
                                Note: {item.notes}
                            </Text>
                        </Col>
                    </Row>
            
            </div>
        );
    }
}

class MobileLogEdit extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            item: {
                entry_id: "",
                user_id: "",
                log_id: "",
                date: "",
                time: "",
                meal_type: "",
                food_consumed: "",
                issue_flag: "",
                duration: "",
                severity: "",
                notes: ""   
            },
            temp_item: {
                entry_id: "",
                user_id: "",
                log_id: "",
                date: "",
                time: "",
                meal_type: "",
                food_consumed: "",
                issue_flag: "",
                duration: "",
                severity: "",
                notes: ""   
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleDelete = () => {
        this.props.deleteItem(this.props.item);
    }

    handleChange = event => {
        

        this.setState({
            temp_item: {
                  ...this.state.temp_item,
                  [event.target.id]: event.target.value
            }
        });

        

    }

    handleSubmit = async event => {
        event.preventDefault();

        var flagBinary = 0;
        if(this.state.temp_item.issue_flag === "Yes"){
            flagBinary = 1;
        }
            //Login and authenticate
            const formData = {
                user_id: this.state.temp_item.user_id,
                entry_id: this.state.temp_item.entry_id,
                log_id: this.state.temp_item.log_id,
                date: this.state.temp_item.date,
                time: this.state.temp_item.time,
                meal_type: this.state.temp_item.meal_type,
                food_consumed: this.state.temp_item.food_consumed,
                issue_flag: flagBinary,
                duration: this.state.temp_item.duration,
                severity: this.state.temp_item.severity,
                notes: this.state.temp_item.notes
            };

            console.log(formData);
            //Send form data to express
            this.props.updateItem(formData);
          
    }

    handleEdit = () => {
        this.props.editItemToggle();
        this.setState({temp_item: this.state.item});
    }

    validateForm(){
        return this.state.item.duration != "" && this.state.item.serverity != "";
    }

    componentDidMount (){
        this.setState({item: this.props.item});
    }

    render(){
        let ApplyButton = "";

        ApplyButton = (
                <div className="applyBttns">
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <ButtonGroup>
                        <Row>
                            <Col xs="2">    
                                <Button className="pull-right" color="success" onClick={this.handleSubmit} style={{fontsize: "1vw", marginBottom: "10px"}}>
                                    Apply
                                </Button>
                            </Col>
                            <Col xs="1"></Col>
                            <Col xs="8">
                                <Button className="pull-right" color="danger" onClick={this.handleDelete}>
                                    Delete Item
                                </Button>
                            </Col>
                        </Row>
                    </ButtonGroup>                        
                </View>
            </div>
        );
        let ItemDisplay = "";

        if(this.props.isItemEditing){
            ItemDisplay = (
                <div>
                    <Row>
                        <Col className="NameCol" xs="3">
                            <FormGroup controlId="food_consumed">
                                <FormControl 
                                    type="food_consumed" 
                                    placeholder="Enter food name" 
                                    value={this.state.temp_item.food_consumed} 
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col className="FlagCol" xs="2">
                            <img src={this.state.temp_item.issue_flag=="1" ? flag_true : flag_false}/>
                        </Col>
                        <Col className="DateCol" xs="2">
                            <Text  style={{fontSize: "3vw", fontWeight: "bold"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                                {this.state.temp_item.date.substring(0,10)}
                            </Text>
                        </Col>
                        {/*<Col className="TimeCol" xs="2">
                            <Text  style={{fontSize: "3vw", fontWeight: "bold"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                                {this.state.temp_item.time}
                            </Text>  
                        </Col>*/}
                        <Col xs="2">
                            <Button className="editBttn" color="primary" onClick={ this.props.editItemToggle.bind(this) } block>
                                    {"Cancel"}
                            </Button>
                        </Col>
                    </Row>

                    <div className="detail">
                    <hr />
                        <Row>
                            <Col>
                                <Text style={{fontSize: "3vw"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                                    Type: 
                                    <Form.Group controlId="meal_type">
                                
                                        <Form.Control as="select" type="meal_type" value={this.state.temp_item.meal_type} onChange={this.handleChange}>
                                            <option>Select</option>
                                            <option>Breakfast</option>
                                            <option>Lunch</option>
                                            <option>Dinner</option>
                                            <option>Snack</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Text>
                            </Col>
                            <Col>
                                <Text style={{fontSize: "3vw"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                                    Duration: 
                                    <FormGroup controlId="duration">
                                            <FormControl 
                                                type="duration" 
                                                placeholder="Enter time in (mins) EX: 30" 
                                                value={this.state.temp_item.duration} 
                                                onChange={this.handleChange}
                                            />
                                        </FormGroup>
                                </Text>
                            </Col> 
                            <Col>
                                <Text style={{fontSize: "3vw"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling>
                                    Severity: 
                                    <FormGroup controlId="severity">
                                                <FormControl style={{width:"90%"}} as="select" type="severity" placeholder="Select" value={this.state.temp_item.severity} onChange={this.handleChange}>
                                                    <option>Select</option>
                                                    <option>0</option>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                    <option>6</option>
                                                    <option>7</option>
                                                    <option>8</option>
                                                    <option>9</option>
                                                </FormControl>
                                        </FormGroup>
                                </Text>
                            </Col> 
                        </Row>
                        <Row>
                            <Col>
                                <Text style={{fontSize: "3vw"}} adjustsFontSizeToFit minimumFontScale={.5} allowFontScaling>
                                    Note: 
                                    <FormGroup controlId="notes">
                                    <FormControl 
                                        style={{width: "97%"}}
                                        type="notes"
                                        as="textArea"
                                        placeholder="Add any notes" 
                                        rows="4"
                                        value={this.state.temp_item.notes}
                                        onChange={this.handleChange} 
                                    >
                                    {this.state.temp_item.notes}
                                    </FormControl>
                                    </FormGroup>
                                </Text>
                            </Col>
                        </Row>
                
                    </div>

                    {ApplyButton}
                </div>
              
            );
        }
        else{
            ItemDisplay = (
                <div className="detail">
                    <Row>
                        <Col className="Name" xs="3">
                            <Text  style={{fontSize: "3vw", fontWeight: "bold"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                                {this.state.item.food_consumed}
                            </Text>


                        </Col>
                        <Col className="Flag" xs="2">
                            <img src={this.state.item.issue_flag=="1" ? flag_true : flag_false}/>
                        </Col>
                        <Col className="Date" xs="2">
                            <Text  style={{fontSize: "3vw", fontWeight: "bold"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                                {this.state.item.date.substring(0,10)}
                            </Text>
                        </Col>
                        {/*<Col className="TimeCol" xs="2">
                            <Text  style={{fontSize: "3vw", fontWeight: "bold"}} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1} allowFontScaling> 
                                {this.state.item.time}
                            </Text>  
                        </Col>*/}
                        <Col xs="2">
                            <Button className="editBttn" color="warning" onClick={ this.handleEdit } block>
                                    {"Edit/Delete"}
                            </Button>
                        </Col>
                    </Row>

                    <MobileLogDetail item={this.state.item} />

                    
                </div>
            );
        }

        return(
            <div>
                {ItemDisplay}
            </div>
        );
    }
}