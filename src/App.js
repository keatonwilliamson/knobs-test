import React from 'react';
import logo from './logo.svg';
import './App.css';
import Knob from './Knob.js'

class App extends React.Component {
  state = { value: 0 };

  handleChange = newValue => {
    this.setState({
      value: newValue
    });
  };
  render() {
    return (
      <div className="App">
        <Knob
          size={100}
          numTicks={1}
          degrees={260}
          min={1}
          max={10}
          value={80}
          color={true}
          onChange={this.handleChange}
        />

        <Knob
                  size={100}
          numTicks={1}
          degrees={180}
          min={1}
          max={100}
          value={60}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}


export default App;
