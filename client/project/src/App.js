import React, { useState } from 'react';
import './App.css';

const App = (props) => {
  const {name}= props
  const [counter, setCounter]= useState(0)

  const clickHandler = () => {
    setCounter(counter + 1);
  }

  return (
    <div>
      Hello world
      {name}
      {counter}

      <button
        onClick={clickHandler} 
        style={ {height: "100", width: "200"} }
      >
        Button
      </button>
    </div>
  );
}

export default App;
