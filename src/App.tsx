import React from 'react';
import './App.css';
import Canvas from './components/canvas';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Canvas />
      </header>
    </div>
  );
}

export default App;
