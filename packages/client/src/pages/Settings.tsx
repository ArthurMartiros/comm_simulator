import React                                        from 'react';
import { localStore }                               from "../services/LocalStore";

export class Settings extends React.Component<any, any> {

  state = {
    serverUrl: localStore.serverUrl || '',
    wsUrl: localStore.wsUrl || '',
  };
  public saveConfig = () => {
    localStore.serverUrl = this.state.serverUrl;
    localStore.wsUrl = this.state.wsUrl;
  };

  public serverUrlChange = async (e) => {
    this.setState({
      serverUrl: e.target.value,
    });
  };

  public wsUrlChange = async (e) => {
    this.setState({
      wsUrl: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <div className="config">
          <div className='url'>
            <div><label>Server URL:</label></div>
            <div><input size={30} value={this.state.serverUrl || ''} onChange={this.serverUrlChange}/></div>
          </div>
          <div className='url'>
            <div><label>WebSocket URL:</label></div>
            <div><input size={30} value={this.state.wsUrl || ''} onChange={this.wsUrlChange}/></div>
          </div>
          <div><button aria-label='Save-Settings' onClick={this.saveConfig}>Save</button></div>
        </div>
      </div>
    );
  }
}