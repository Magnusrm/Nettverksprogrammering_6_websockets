// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import {Component} from 'react-simplified';
import {HashRouter, Route, NavLink} from 'react-router-dom';
import {Alert} from './widgets';
import {studentService} from './services';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
    let script = document.createElement('script');
    script.src = '/reload/reload.js';
    if (document.body) document.body.appendChild(script);
}


class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            connected: false,
            name: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    emit() {
        this.setState(prevState => ({
            open: !prevState.open
        }))
        this.socket.send("It worked!")
    }

    componentDidMount() {

    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }


    handleSubmit(event) {
        console.log('sbmit')
        this.socket = new WebSocket('ws://localhost:3001');
        this.emit = this.emit.bind(this);


        this.socket.onopen = () => {
            this.socket.send('Hello server, my name is ' + this.state.name);

            this.setState({
                connected: true
            })
        };


        this.socket.onmessage = ({data}) => {
            console.log(data);
            this.socket.close();
        };

        this.socket.onclose = () => {
            this.setState({
                connected: false
            })
        };


        event.preventDefault();

    }

    render() {
        let connectedLabel;
        if (this.state.connected) {
            connectedLabel = <h2></h2>;
        } else {
            connectedLabel = <h2></h2>;
        }

        return (
            <div className="App">
                <header className="App-header">
                    {connectedLabel}
                </header>
                <form>
                    <label>
                        Name:
                        <input value={this.state.name} onChange={this.handleChange} type="text" name="value"/>
                    </label>
                    <button onClick={this.handleSubmit}>Send message</button>
                </form>
            </div>
        );
    }
}

class Home extends Component {
    render() {
        return <div>
        </div>;
    }
}


const root = document.getElementById('root');
if (root)
    ReactDOM.render(
        <HashRouter>
            <div>
                <Alert/>
                <Menu/>
                <Route exact path="/" component={Home}/>
            </div>
        </HashRouter>,
        root
    );
