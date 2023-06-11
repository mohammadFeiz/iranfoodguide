import exportToExcel from './export-to-excel';
import align from './align';
import splitNumber from './split-number';
import getClient from './get-client';
import downloadUrl from './download-url';
import search from './search';

export function ExportToExcel(list,config){return exportToExcel(list,config);}
export function Align(dom,taget,config){return align(dom,taget,config);}
export function SplitNumber(number,count,splitter){return splitNumber(number,count,splitter);}
export function GetClient(e){return getClient(e);}
export function DownloadUrl(url,name){return downloadUrl(url,name);}
export function Search(items,searchValue,getValue){return search(items,searchValue,getValue);}


