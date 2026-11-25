'use client';

import {useEffect,useRef} from 'react';
import {Compass,MapPin,ExternalLink,X} from 'lucide-react';

type Resource='activities'|'locations';
type Row=Record<string,unknown>;
const fieldDefinitions:Record<Resource,{key:string;label:string}[]>={
 activities:[
  {key:'name',label:'Activity name'},
  {key:'subtype',label:'Subtype'},
  {key:'environment',label:'Environment'},
  {key:'category',label:'Category'},
  {key:'description',label:'Description'},
  {key:'skill_level',label:'Skill level'},
  {key:'equipment',label:'Equipment required'},
  {key:'status',label:'Verification status'},
  {key:'source_url',label:'Source URL'},
  {key:'last_verified',label:'Date verified'}
 ],
 locations:[
  {key:'name',label:'Location name'},
  {key:'region',label:'WA region'},
  {key:'setting',label:'Setting'},
  {key:'latitude',label:'Latitude'},
  {key:'longitude',label:'Longitude'},
  {key:'access_type',label:'Access information'},
  {key:'facilities',label:'Facilities'},
  {key:'source_url',label:'Source URL'},
  {key:'status',label:'Verification status'},
  {key:'last_verified',label:'Date verified'}
 ]
};
function formatted(value:unknown,key:string):string {
 if(value===null||value===undefined||value==='')return 'Not provided';
 if(Array.isArray(value))return value.length?value.join(' · '):'Not provided';
 if(key==='last_verified' && typeof value==='string')return value.slice(0,10);
 return String(value);
}
function safeUrl(value:unknown):string|null {
 if(typeof value!=='string'||!value.trim())return null;
 try {const url=new URL(value.startsWith('www.')?`https://${value}`:value);return url.protocol==='https:'||url.protocol==='http:'?url.href:null} catch{return null}
}
const hiddenKeys=new Set(['id','created_at','updated_at']);
const longFields=new Set(['description','equipment','facilities','access_type']);
export default function RecordDetails({resource,record,onClose}:{resource:Resource;record:Row;onClose:()=>void}){
 const closeRef=useRef<HTMLButtonElement>(null);
 const titleId=resource==='activities'?'activity-details-title':'location-details-title';
 const name=resource==='activities'?'Activity':'Location';
 const Icon=resource==='activities'?Compass:MapPin;
 useEffect(()=>{
  closeRef.current?.focus();
  function handleKey(e:KeyboardEvent){if(e.key==='Escape')onClose()}
  document.addEventListener('keydown',handleKey);
  return()=>document.removeEventListener('keydown',handleKey);
 },[onClose]);
 const standard=fieldDefinitions[resource];
 const present=new Set(standard.map(x=>x.key));
 const extras=Object.keys(record).filter(key=>!present.has(key)&&!hiddenKeys.has(key)&&key!=='code').map(key=>({key,label:key.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}));
 return <div className="backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
  <div className="dialog organisation-details-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
   <div className="dialog-head">
    <div><div className="organisation-details-kicker"><Icon size={16}/>{name} profile · {formatted(record.code,'code')}</div>
    <h2 id={titleId}>{formatted(record.name,'name')}</h2>
    <p>Read-only details saved in the Outdoors WA database</p></div>
    <button ref={closeRef} type="button" onClick={onClose} aria-label={`Close ${name.toLowerCase()} details`}><X size={22}/></button>
   </div>
   <div className="organisation-details-grid">
    {[...standard.filter(x=>x.key!=='name'),...extras].map(field=>{
     const value=record[field.key];const href=field.key==='source_url'?safeUrl(value):null;
     const empty=value===null||value===undefined||value===''||(Array.isArray(value)&&value.length===0);
     return <div key={field.key} className={`organisation-detail-field ${longFields.has(field.key)?'wide':''}`}>
      <span className="organisation-detail-label">{field.label}</span>
      {href?<a href={href} target="_blank" rel="noopener noreferrer" className="organisation-detail-value organisation-detail-link">{formatted(value,field.key)} <ExternalLink size={13}/></a>:
      <span className={`organisation-detail-value ${empty?'organisation-detail-empty':''}`}>{formatted(value,field.key)}</span>}
     </div>
    })}
   </div>
   <div className="form-actions"><button type="button" className="btn subtle" onClick={onClose}>Close</button></div>
  </div>
 </div>;
}
