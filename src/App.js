import React, { Component } from 'react';

const NumberButtons = [
  {id: "one", number: 1},
  {id: "two", number: 2},
  {id: "three", number: 3},
  {id: "four", number: 4},
  {id: "five", number: 5},
  {id: "six", number: 6},
  {id: "seven", number: 7},
  {id: "eight", number: 8},
  {id: "nine", number: 9},
  {id: "zero", number: 0},
],

OperatorButtons = [
  {id: "add", operator: "+", sign: "+"},
  {id: "subtract", operator: "-", sign: "-"},
  {id: "multiply", operator: "*", sign: "x"},
  {id: "divide", operator: "/", sign: "÷"},
]

class App extends Component {
  constructor(props){
    super(props)
  this.state = {
    display: "0"
  }
}

numberInput = (digit) => {
  const { display } = this.state //destructuring for this.display.state
  this.setState({
    display: display === "0" ? String(digit) : display + String(digit)
  })
}

decimalInput = () => {
  const { display } = this.state;
  if (display.indexOf(".") < 0){ //This ensures that only one decimal dot is used per integer
  this.setState({
      display: display + "."
  })
}
}
clearInput = () => {
  this.setState({
    display: "0"
  })
}
operatorInput = (operator) => {
  const { display } = this.state
  let regex = /([+]|[*]|[/]|-)$/;
   if (regex.test(display)){
  this.setState({
    display: display.replace(/.$/, operator)
  }) //This ensures that multiple math operators won't be entered sequentially
}
  this.setState({
    display: display + operator
  });
}
performEquation = () => {
  const { display } = this.state
  let regex = /([+]|[*]|[/]|-)$/;
  this.audio.play()
  if (display==="0" | regex.test(display)) {
    this.setState({
      display: String(display)
    })
  } //prevents errors that occur when trying to perform eval("0") or a statement that ends w/ operator, e.g. eval("9+")
  else if (display==="") {
    this.clearInput()
  } //prevents an "undefined" message
  this.setState({
    display: String(eval(display))
  }) //evaluates the equation in display
}
handleKeyDown = event => {
  const { key, which } = event,
  { display } = this.state;

  if ((/\d/).test(key)) {
   this.numberInput(key)
  }//handling digits
  else if((/([+]|[*]|[/]|-)/).test(key)) {
    this.operatorInput(key)
  }//handling operators
  else if (key==="Enter" | key==="=" | which===32) {
    event.preventDefault()
    this.performEquation()
  }//"=" key is "Enter", "=", or "Space"
  else if (key==="Backspace") {
    this.setState({
      display: String(display.slice(0, display.length-1))
    })
  }//removing last character w/ backspace
} 

//lifecycle events for key press:

componentDidMount() {
  document.addEventListener('keydown', this.handleKeyDown) 
  window.focus()//Ensures that the event listener will be active upon page load
}

componentWillUnmount() {
  document.removeEventListener('keydown', this.handleKeyDown)
}
  render() {
    return (
      <div className="App container">
      <div className="Outer-grid container">
        <div className="Display container">
        <span id="display">{this.state.display}</span>
        </div>
          <div className="Numbers container">
            {NumberButtons.map( x => <button className="number-button z-depth-1" id={x.id} onClick={() => this.numberInput(x.number)} >{x.number}</button>)}
            <button className= "z-depth-1" id="decimal" onClick={this.decimalInput}>.</button>
            <button className="z-depth-1" id="clear" onClick={this.clearInput}>Clear</button>
            {OperatorButtons.map( y => <button className="operator-button z-depth-1" id={y.id} onClick={() => this.operatorInput(y.operator)}>{y.sign}</button>)}
          </div>
          <div className="Equals container">
            <button id="equals" className="z-depth-1" src="http://s1download-universal-soundbank.com/mp3/sounds/146.mp3" onClick={this.performEquation}>=</button>
            <audio className="clip" id ={this.props.letter} src="http://s1download-universal-soundbank.com/mp3/sounds/147.mp3" ref={ref => this.audio = ref}/>
          </div>
        </div>
        <p>The Quackulator. Code by Ryan Hussey</p>
      </div>
    );
  }
}

export default App;
