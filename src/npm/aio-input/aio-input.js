import AIOInput from 'aio-input';
//AIOInput.defaults.validate = true;
AIOInput.defaults.mapApiKeys = {
  map:'web.35e83d6326f549209b49716be286996d',
  service:'service.8f415c084c3f41838bcdec5b14d85e40'
}
export default function AIOInputInterface(props){return <AIOInput {...props}/>}