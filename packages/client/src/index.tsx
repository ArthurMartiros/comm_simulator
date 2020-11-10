import React        from 'react';
import ReactDOM     from 'react-dom';
import './index.css';
import App          from './components/App';
import "@blueprintjs/core/lib/css/blueprint.css";
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { Provider } from "react-redux";
import { store }    from "./store";
import { guid }     from "@ffn/communicator-tools";

async function main() {
  const deviceId = window.localStorage.getItem('deviceId');
  if (!deviceId) {
    window.localStorage.setItem('deviceId', guid())
  }
  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>, document.getElementById('root')
  );
}

window.onload = () => {
  main().catch((e) => {
    console.error('Communicator Simulator Failed', e);
  });
}
