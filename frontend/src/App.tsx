import React from 'react';
import AppConfig from './AppConfig';
import AsteroidsBackground from './components/AsteroidsBackground';


function App() {
  return (
    <div className="App">
      <AsteroidsBackground />
      <React.StrictMode>
        <AppConfig></AppConfig>
      </React.StrictMode>
    </div>
  );
}

export default App;
