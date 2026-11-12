const text=v=>String(v??'').trim();
function count(v,label){if(v===''||v==null||!Number.isInteger(Number(v))||Number(v)<0)throw new Error(`Invalid ${label}`);return Number(v)}
export function model(rows,season){
 const matches=new Map(),players=new Map(),seen=new Set();
 for(const r of rows){if(text(r[0])!==season)continue;
  const [s,id,date,opponent,gf,ga,name,goals,clean]=r,key=text(id);if(!key||!text(opponent))throw new Error('Missing match ID or opponent');
  const m={id:key,date:text(date),opponent:text(opponent),gf:count(gf,'team goals'),ga:count(ga,'goals against')};
  const existing=matches.get(key);if(existing&&JSON.stringify(existing)!==JSON.stringify(m))throw new Error(`Conflicting scores or dates for ${key}`);matches.set(key,m);
  if(!text(name))continue;const pk=`${key}:${text(name).toLowerCase()}`;if(seen.has(pk))throw new Error(`Duplicate player row for ${name} in ${key}`);seen.add(pk);
  if(typeof clean!=='boolean'&&!['true','false',''].includes(text(clean).toLowerCase()))throw new Error(`Clean sheet must be TRUE or FALSE for ${name}`);
  const cs=clean===true||text(clean).toLowerCase()==='true';if(cs&&m.ga!==0)throw new Error(`Clean sheet conflicts with goals against for ${key}`);
  const p=players.get(text(name))??{name:text(name),goals:0,cleanSheets:0};p.goals+=count(goals,'player goals');p.cleanSheets+=Number(cs);players.set(p.name,p);
 }
 const games=[...matches.values()].sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
 const team={played:games.length,wins:0,draws:0,losses:0,gf:0,ga:0,cleanSheets:0};
 for(const m of games){m.result=m.gf>m.ga?'W':m.gf===m.ga?'D':'L';team[m.result==='W'?'wins':m.result==='D'?'draws':'losses']++;team.gf+=m.gf;team.ga+=m.ga;team.cleanSheets+=Number(m.ga===0)}team.gd=team.gf-team.ga;
 const squad=[...players.values()].sort((a,b)=>b.goals-a.goals||a.name.localeCompare(b.name));
 const boot=squad.filter(p=>p.goals>0).map((p,i,a)=>({...p,rank:a.filter(x=>x.goals>p.goals).length+1}));return{team,games,squad,boot};
}
export const seasons=rows=>[...new Set(rows.map(r=>text(r[0])).filter(Boolean))].sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));
