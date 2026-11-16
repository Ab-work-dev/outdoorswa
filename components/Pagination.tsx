'use client';
import {ChevronLeft,ChevronRight,ChevronsLeft,ChevronsRight} from 'lucide-react';

export type PageData<T>={rows:T[];total:number;page:number;pageSize:number;totalPages:number};
export default function Pagination({page,total,pageSize,onPage,onSize,disabled=false}:{page:number;total:number;pageSize:number;onPage:(page:number)=>void;onSize:(size:number)=>void;disabled?:boolean}){
 const pages=Math.ceil(total/pageSize);const start=total?(page-1)*pageSize+1:0;const end=Math.min(page*pageSize,total);
 return <nav className="pagination" aria-label="Table pagination">
  <span className="page-summary">Showing <b>{start}–{end}</b> of <b>{total}</b> records</span>
  <label className="page-size-label">Rows per page <select aria-label="Rows per page" value={pageSize} disabled={disabled} onChange={e=>onSize(Number(e.target.value))}>{[10,25,50,100].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
  <div className="page-buttons">
   <button type="button" title="First page" aria-label="First page" disabled={disabled||page<=1} onClick={()=>onPage(1)}><ChevronsLeft size={16}/></button>
   <button type="button" title="Previous page" aria-label="Previous page" disabled={disabled||page<=1} onClick={()=>onPage(page-1)}><ChevronLeft size={16}/></button>
   <span aria-live="polite">Page {pages?Math.min(page,pages):0} of {pages}</span>
   <button type="button" title="Next page" aria-label="Next page" disabled={disabled||page>=pages} onClick={()=>onPage(page+1)}><ChevronRight size={16}/></button>
   <button type="button" title="Last page" aria-label="Last page" disabled={disabled||page>=pages} onClick={()=>onPage(pages)}><ChevronsRight size={16}/></button>
  </div>
 </nav>
}
