'use client';

import {useEffect,useRef} from 'react';
import {ExternalLink,X,Building2} from 'lucide-react';

type Organisation = Record<string,unknown>;
type DetailField = {key:string;label:string};
const detailFields:DetailField[]=[
 {key:'name',label:'Organisation name'},
 {key:'organisation_type',label:'Organisation type'},
 {key:'roles',label:'Roles'},
 {key:'services',label:'Services / resources'},
 {key:'audience',label:'Audience (who they support / serve)'},
 {key:'participation_role',label:'Participation role'},
 {key:'strategic_relevance',label:'Strategic relevance to OWA'},
 {key:'existing_owa_relationship',label:'Existing OWA relationship'},
 {key:'notes',label:'Notes (relevant observations)'},
 {key:'region',label:'WA region'},
 {key:'website',label:'Website'},
 {key:'email',label:'Email'},
 {key:'phone',label:'Public phone'},
 {key:'source_url',label:'Source URL'},
 {key:'status',label:'Verification status'},
 {key:'last_verified',label:'Date verified'}
];
function display(value:unknown):string {
 if(value===null||value===undefined||value==='')return 'Not provided';
 if(Array.isArray(value))return value.length?value.join(' · '):'Not provided';
 return String(value);
}
function safeUrl(value:unknown):string|null {
 if(typeof value!=='string'||!value.trim())return null;
 try {const u=new URL(value.startsWith('www.')?`https://${value}`:value);return ['https:','http:'].includes(u.protocol)?u.href:null} catch{return null}
}
export default function OrganisationDetails({organisation,onClose}:{organisation:Organisation;onClose:()=>void}){
 const closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{closeRef.current?.focus();function onKeyDown(e:KeyboardEvent){if(e.key==='Escape')onClose()};document.addEventListener('keydown',onKeyDown);return()=>document.removeEventListener('keydown',onKeyDown)},[onClose]);
 return <div className="backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div className="dialog organisation-details-dialog" role="dialog" aria-modal="true" aria-labelledby="organisation-details-title">
   <div className="dialog-head">
    <div><div className="organisation-details-kicker"><Building2 size={16}/> Organisation profile · {display(organisation.code)}</div><h2 id="organisation-details-title">{display(organisation.name)}</h2><p>Read-only record details saved in the Outdoors WA database</p></div>
    <button ref={closeRef} type="button" onClick={onClose} aria-label="Close organisation details"><X size={22}/></button>
   </div>
   <div className="organisation-details-grid">
    {detailFields.filter(f=>f.key!=='name').map(f=>{
     const val=organisation[f.key];const href=(f.key==='website'||f.key==='source_url')?safeUrl(val):null;
     return <div className={`organisation-detail-field ${['services','audience','notes','roles'].includes(f.key)?'wide':''}`} key={f.key}>
      <span className="organisation-detail-label">{f.label}</span>
      {href?<a href={href} target="_blank" rel="noopener noreferrer" className="organisation-detail-value organisation-detail-link">{display(val)} <ExternalLink size={13}/></a>:
       f.key==='email'&&typeof val==='string'&&val.trim()?<a className="organisation-detail-value organisation-detail-link" href={`mailto:${val}`}>{val}</a>:
       <span className={`organisation-detail-value ${val===undefined||val===null||val===''||(Array.isArray(val)&&!val.length)?'organisation-detail-empty':''}`}>{f.key==='last_verified'&&typeof val==='string'&&val?val.slice(0,10):display(val)}</span>}
     </div>;
    })}
   </div>
   <div className="form-actions"><button className="btn subtle" onClick={onClose}>Close</button></div>
  </div>
 </div>;
}
