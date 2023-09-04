export default class URL{
  toJson = (url)=>{
    try{
      return JSON.parse(`{"${decodeURI(url.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)
    }
    catch{return {}}
  }
  toBase = (url)=>{
    return url.split('?')[0];
  }
  add = (url,obj)=>{
    let json = this.toJson(url)
    for(let prop in obj){json[prop] = obj[prop]}
    return this.update(url,json); 
  }
  remove = (url,key)=>{
    let json = this.toJson(url)
    let newJson = {};
    for(let prop in json){
      if(prop !== key){newJson[prop] = json[prop]} 
    }
    return this.update(url,newJson); 
  }
  update = (url,obj)=>{
    let base = this.toBase(url);
    let keys = Object.keys(obj);
    for(let i = 0; i < keys.length; i++){
      if(i === 0){base += '?'}
      let key = keys[i];
      base += `${key}=${obj[key]}`
      if(i < keys.length - 1){base += '&'}
    }
    return base;
  }
  getPageUrl = ()=>window.location.href
  setPageUrl = (url)=>window.history.replaceState({},document.title,url); 
  
}