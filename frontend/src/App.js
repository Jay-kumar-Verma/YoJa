import React from 'react';
import './styles/App.css';
import YogaPosture from './components/YogaPosture';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Yoga Posture Monitoring</h1>
      </header>
      <main>
        <YogaPosture />
      </main>
    </div>
  );
}

export default App;