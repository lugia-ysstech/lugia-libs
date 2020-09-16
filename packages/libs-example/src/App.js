import React, { Component } from 'react';
import logo from './logo.svg';
import Theme from '@lugia/theme-config';

class App extends Component {
  render() {
    return (
      <Theme globalTheme={{
        DisabledViewClass:{
          disabled: {
            background: {
              color: 'black',
            },
          },
        }
      }}>
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
      </Theme>
    );
  }
}

export default App;
