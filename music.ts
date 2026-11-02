export const majorKeys = ['C','G','D','A','E','B','F♯','D♭','A♭','E♭','B♭','F'];
export const relativeMinors = ['Am','Em','Bm','F♯m','C♯m','G♯m','D♯m','B♭m','Fm','Cm','Gm','Dm'];
export const pc:Record<string,number>={C:0,'B♯':0,'C♯':1,'D♭':1,D:2,'D♯':3,'E♭':3,E:4,F:5,'E♯':5,'F♯':6,'G♭':6,G:7,'G♯':8,'A♭':8,A:9,'A♯':10,'B♭':10,B:11};
export const sharpNames=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
export const flatNames=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
export const signatures:Record<string,string>={C:'無升降記號',G:'1 ♯',D:'2 ♯',A:'3 ♯',E:'4 ♯',B:'5 ♯','F♯':'6 ♯','D♭':'5 ♭','A♭':'4 ♭','E♭':'3 ♭','B♭':'2 ♭',F:'1 ♭'};
export const pitchName=(n:number,flat=false)=> (flat?flatNames:sharpNames)[((n%12)+12)%12];
export const freq=(midi:number)=>440*Math.pow(2,(midi-69)/12);
export type Note={id:string;pitch:number;start:number;duration:number;velocity:number;confidence?:number;};
export type Track={id:string,name:string,instrument:string,muted:boolean,notes:Note[]};
export type Project={id:string,name:string,bpm:number,meter:[number,number],keyIndex:number,mode:'major'|'minor',tracks:Track[],bars:number};
export const uid=()=>Math.random().toString(36).slice(2,10);
export function makeProject():Project{return {id:uid(),name:'未命名作品',bpm:110,meter:[4,4],keyIndex:0,mode:'major',bars:16,tracks:Array.from({length:8},(_,i)=>({id:uid(),name:['主旋律','高音和聲','中音和聲','低音和聲','Bass','鋼琴','Pad','節奏層'][i],instrument:['Lead','Choir','Strings','Cello','Bass','Piano','Pad','Percussion'][i],muted:i>0,notes:i===0?[{id:uid(),pitch:60,start:0,duration:1,velocity:90},{id:uid(),pitch:64,start:1,duration:1,velocity:85},{id:uid(),pitch:67,start:2,duration:2,velocity:90}]:[]}))};}
export function triad(root:number,degree:number,mode:'major'|'minor'='major'){
 const maj=[0,2,4,5,7,9,11],min=[0,2,3,5,7,8,10],intervals=mode==='major'?maj:min;
 const qualities=mode==='major'?['','m','m','','','m','dim']:['m','dim','','m','m','',''];
 const n=(root+intervals[degree%7])%12;return {root:n,quality:qualities[degree%7]};
}
export function chordProgression(keyIndex:number,mode:'major'|'minor',kind:string){
 const root=pc[majorKeys[keyIndex]],steps:Record<string,number[]>={pop:[0,4,5,3],sad:[5,3,0,4],jazz:[1,4,0,5],cinema:[0,3,1,4],borrow:[0,5,3,3]};
 const ds=steps[kind]||steps.pop;
 return ds.map((d,i)=>{if(kind==='borrow'&&i===1)return {root:(root+8)%12,quality:'maj'};if(kind==='borrow'&&i===3)return {root:(root+5)%12,quality:'m'};return triad(root,d,mode);});
}
export function midiFile(project:Project):Blob{
 const bytes:number[]=[];const push=(...v:number[])=>bytes.push(...v);
 const vlq=(n:number)=>{let b=[n&127];while((n>>=7)){b.unshift((n&127)|128);}return b;};
 const chunks:number[][]=[];
 const events:{t:number,b:number[]}[]=[];
 const ppq=480,barTicks=ppq*4;
 project.tracks.filter(t=>!t.muted).forEach((track,ti)=>{
  const ev:{t:number,b:number[]}[]=[];
  track.notes.forEach(note=>{const start=Math.max(0,Math.round(note.start*ppq)),end=Math.max(start+1,Math.round((note.start+note.duration)*ppq)),p=Math.max(0,Math.min(127,note.pitch));ev.push({t:start,b:[0x90+ti,p,note.velocity]},{t:end,b:[0x80+ti,p,0]});});
  ev.sort((a,b)=>a.t-b.t);let last=0,trackBytes:number[]=[];
  ev.forEach(e=>{trackBytes.push(...vlq(e.t-last),...e.b);last=e.t;});
  trackBytes.push(0,0xff,0x2f,0);chunks.push(trackBytes);
 });
 const header=[0x4d,0x54,0x68,0x64,0,0,0,6,0,1,(chunks.length>>8)&255,chunks.length&255,1,0xe0];
 const out=[...header];chunks.forEach(c=>out.push(0x4d,0x54,0x72,0x6b,(c.length>>>24)&255,(c.length>>>16)&255,(c.length>>>8)&255,c.length&255,...c));
 return new Blob([new Uint8Array(out)],{type:'audio/midi'});
}
