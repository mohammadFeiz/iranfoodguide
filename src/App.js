import React,{Component} from 'react';
import RSA from './npm/react-super-app/react-super-app';
import CommingSoon from './components/comming-soon/commin-soon';
import AIOService from './npm/aio-service/aio-service';
import apis from './apis';
import AppContext from './app-context';
import './App.css';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      comming_soon:true
    }
    this.state.apis = AIOService({getState:()=>this.state,apis})
  }
  render(){
    let {comming_soon} = this.state;
    
    return (
      <AppContext.Provider value={this.state}>
        {comming_soon && <CommingSoon/>}
        {
          !comming_soon && 
          <RSA/>
        }
      </AppContext.Provider>
      
    )
  }
}