import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const header = fs.readFileSync(new URL('../assets/site-header.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../contact.html', import.meta.url), 'utf8');
const handler = html.match(/function handleSubmit\(e\)\{[\s\S]*?(?=\/\* ─── URL-PARAM PREFILL)/)[0];
const tick = () => new Promise(resolve => setImmediate(resolve));
function fixture({url='https://www.plainblackcreative.com/contact', referrer='', store=new Map(), blocked=false, fetcher=async()=>new Response('{"ok":true}'), analytics=true}={}){
  const calls=[], events=[], nodes={};
  for(const id of ['form','submitBtn','errorMsg','successMsg','successShortcut']){
    nodes[id]={dataset:{},style:{},textContent:'Send Message',scrollIntoView(){}};
  }
  const document={referrer,readyState:'loading',querySelector:()=>null,addEventListener(){},getElementById:id=>nodes[id]};
  class Form extends FormData {
    constructor(){super();this.set('interest','customtool');this.set('name','Private Name');this.set('email','private@example.invalid');this.set('message','Private message');}
  }
  const context=vm.createContext({URL,URLSearchParams,Date,location:new URL(url),document,FormData:Form,
    sessionStorage:{getItem:k=>{if(blocked)throw Error('blocked');return store.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');store.set(k,v);}},
    fetch:(...args)=>{calls.push(args);return fetcher(...args);}});
  context.window=context;
  if(analytics)context.gtag=(...args)=>events.push(args);
  vm.runInContext(header,context);
  vm.runInContext(handler,context);
  return {context,nodes,calls,events,store,submit:()=>context.handleSubmit({preventDefault(){}})};
}
test('page visit alone sends no enquiry event',()=>{
  const f=fixture();assert.equal(f.events.length,0);assert.equal(f.context.PBEnquiry.context().source_page,'(unavailable)');
});
test('campaign survives service and contact navigation; only paths and labels are retained',()=>{
  const store=new Map();
  fixture({store,url:'https://www.plainblackcreative.com/blog/example?utm_source=newsletter&utm_medium=email&utm_campaign=september&email=private@example.invalid'});
  fixture({store,url:'https://www.plainblackcreative.com/services',referrer:'https://www.plainblackcreative.com/blog/example?email=private@example.invalid'});
  const f=fixture({store,url:'https://www.plainblackcreative.com/contact?from=services-ai-tools&name=Private',referrer:'https://www.plainblackcreative.com/services?email=private@example.invalid'});
  const c=f.context.PBEnquiry.context();
  assert.equal(c.source_page,'/services');assert.equal(c.landing_page,'/blog/example');assert.equal(c.source_tool,'services-ai-tools');
  assert.equal(c.enquiry_campaign_source,'newsletter');assert.equal(c.enquiry_campaign_medium,'email');assert.equal(c.enquiry_campaign,'september');
  assert.doesNotMatch(JSON.stringify([...store]),/private|Private|@|\?/);
});
test('new campaign and expired tab attribution reset the journey',()=>{
  const store=new Map();fixture({store,url:'https://www.plainblackcreative.com/?utm_source=old'});
  const f=fixture({store,url:'https://www.plainblackcreative.com/services?utm_source=new'});
  assert.equal(f.context.PBEnquiry.context().landing_page,'/services');assert.equal(f.context.PBEnquiry.context().enquiry_campaign_source,'new');
  const key=[...store.keys()][0];const saved=JSON.parse(store.get(key));saved.at-=31*60*1000;store.set(key,JSON.stringify(saved));
  const expired=fixture({store});assert.equal(expired.context.PBEnquiry.context().enquiry_campaign_source,'(not set)');
});
test('blocked storage uses same-site referrer; external referrer and unsafe labels are omitted',()=>{
  const f=fixture({blocked:true,referrer:'https://www.plainblackcreative.com/tools/briefs?id=private',url:'https://www.plainblackcreative.com/contact?from=private%40example.com&utm_source=private%40example.com'});
  assert.equal(f.context.PBEnquiry.context().source_page,'/tools/briefs');assert.equal(f.context.PBEnquiry.context().source_tool,'none');assert.equal(f.context.PBEnquiry.context().enquiry_campaign_source,'(not set)');
  const external=fixture({referrer:'https://other.example/private-name?email=private@example.invalid'});
  assert.equal(external.context.PBEnquiry.context().source_page,'(unavailable)');
});
for(const [name,fetcher] of [
  ['service rejection',async()=>new Response('{"ok":false}')],
  ['HTTP error with misleading ok body',async()=>new Response('{"ok":true}',{status:500})],
  ['invalid JSON',async()=>new Response('bad')],
  ['null response',async()=>new Response('null')],
  ['truthy string',async()=>new Response('{"ok":"false"}')],
  ['network failure',async()=>{throw Error('offline');}]
])test(name+' sends zero lead events and allows retry',async()=>{
  const f=fixture({fetcher});f.submit();await tick();assert.equal(f.events.length,0);assert.equal(f.nodes.submitBtn.disabled,false);assert.equal(f.nodes.errorMsg.style.display,'block');
});
test('one confirmed enquiry produces one event; double clicks and repeated completion are ignored',async()=>{
  let finish;const f=fixture({fetcher:()=>new Promise(r=>finish=r),referrer:'https://www.plainblackcreative.com/services?email=private@example.invalid',url:'https://www.plainblackcreative.com/contact?from=services-ai-tools'});
  f.submit();f.submit();assert.equal(f.calls.length,1);assert.equal(f.events.length,0);
  finish(new Response('{"ok":true}'));await tick();f.submit();f.context.PBEnquiry.confirmed('customtool');
  assert.equal(f.calls.length,1);assert.equal(f.events.length,1);assert.equal(f.events[0][1],'generate_lead');
  const p=f.events[0][2];assert.equal(p.service_interest,'customtool');assert.equal(p.source_page,'/services');assert.equal(p.source_tool,'services-ai-tools');
  assert.doesNotMatch(JSON.stringify(p),/Private|private|@|\?/);assert.equal(f.nodes.successMsg.style.display,'block');
  assert.equal(f.calls[0][1].body.get('source_page'),'/services');assert.equal(f.calls[0][1].body.get('email'),'private@example.invalid');
});
test('failed attempt followed by accepted retry counts exactly once',async()=>{
  let count=0;const f=fixture({fetcher:async()=>new Response(JSON.stringify({ok:++count>1}))});
  f.submit();await tick();f.submit();await tick();assert.equal(f.calls.length,2);assert.equal(f.events.length,1);
});
test('missing or throwing analytics cannot break successful form delivery',async()=>{
  for(const mode of ['missing','throws']){
    const f=fixture({analytics:false});if(mode==='throws')f.context.gtag=()=>{throw Error('blocked');};
    f.submit();await tick();assert.equal(f.nodes.successMsg.style.display,'block');assert.equal(f.nodes.errorMsg.style.display,'none');
  }
});
test('all executable inline contact scripts parse',()=>{
  for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
    if(!m[1].includes('application/ld+json'))new vm.Script(m[2]);
  }
});
