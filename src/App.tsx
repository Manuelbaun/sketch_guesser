import React from 'react';
import './App.css';
import Canvas from './components/drawing/canvas';
import MessageBox from './components/messages/messageBox';
import Message from './components/messages/message.interface';


const msg: Array<Message> = [{
  time: new Date(),
  user: "Benno",
  message: "Hallo all ok",
},
{
  time: new Date(),
  user: "Hans Klaus",
  message: "Ein Llanger test sonst kok",
}, {
  time: new Date(),
  user: "Franz",
  message: "Hallo all ok",
}]

const App: React.FC = () => {

  Date()

  return (
    <div className="App">
      <header className="App-header">
        <Canvas />
        <MessageBox list={msg} />


      </header>
    </div>
  );
}

export default App;
