import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
const root=new URL('../', import.meta.url);
const scripts=file=>Array.from(fs.readFileSync(new URL(file,root),'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi),m=>m[1]);
const firstFix=scripts('first-fix.html').find(s=>s.includes('const FF_CONFIG'));
const contact=scripts('contact.html').find(s=>s.includes('function handleSubmit(e)'));
const key='plainblack:first-fix:contact:v1';
const answers={q1:'clarity',q1Other:'',q2:['name'],q3:'',q4:'nz',q5:'A & B <tag> "quoted"\nSecond line.',name:"Local O'Test",email:'local@example.invalid'};
// Small DOM doubles isolate request and handoff behavior. Layout is checked in the browser.
class Element {
  constructor(){this.textContent='';this.innerHTML='';this.value='';this.hidden=false;this.style={};this.attributes={};this.listeners={};const names=new Set();this.classList={add:n=>names.add(n),remove:n=>names.delete(n),contains:n=>names.has(n),toggle:(n,on)=>on?names.add(n):names.delete(n)};}
  setAttribute(k,v){this.attributes[k]=v;}
  getAttribute(k){return this.attributes[k]??null;}
  addEventListener(n,fn){this.listeners[n]=fn;}
  scrollIntoView(){}
  focus(){}
  querySelector(selector){const match=selector.match(/^option\[value="([^"]+)"\]$/);return match&&['branding','ideaengine','website','brief','quotefilter','customtool','other'].includes(match[1])?{}:null;}
  querySelectorAll(){return [];}
}
function storage(){const entries=new Map();return{entries,getItem:k=>entries.get(k)||null,setItem:(k,v)=>entries.set(k,v),removeItem:k=>entries.delete(k)};}
function fixture({fetch=async()=>new Response('{"ok":true,"confirmation_sent":true}'),store=storage(),search=''}={}){
 const nodes=new Map();const get=s=>{if(!nodes.has(s))nodes.set(s,new Element());return nodes.get(s);};
 const doc={readyState:'loading',querySelector:get,getElementById:k=>get('#'+k),querySelectorAll:()=>[],addEventListener(){}};
 let now=Date.now();const timers=new Map();let timerId=0;
 class Clock extends Date { static now(){return now;} }
 const context=vm.createContext({document:doc,window:{URLSearchParams,location:{search}},location:{search},URLSearchParams,URL,FormData,AbortController,crypto:webcrypto,Date:Clock,sessionStorage:store,fetch,console,requestAnimationFrame:fn=>fn(),setTimeout:(fn,ms)=>{const id=++timerId;timers.set(id,{fn,ms});return id;},clearTimeout:id=>timers.delete(id)});
 return {context,get,store,timers,advance:ms=>{now+=ms;}};
}
function tool(opts){const f=fixture(opts);vm.runInContext(firstFix.replace("  if(document.readyState === 'loading'){","  globalThis.api = {state, submit, restart, sendEmail, buildContactUrl, saveContactHandoff};\n  if(document.readyState === 'loading'){"),f.context);f.api=f.context.api;f.api.state.answers={...answers,q2:[...answers.q2]};return f;}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const status=f=>f.get('[data-email-status]').textContent;
const visible=f=>f.get('[data-result]').classList.contains('is-shown');
test('diagnosis appears while email is pending; success requires explicit visitor-copy confirmation',async()=>{
 let finish;const f=tool({fetch:()=>new Promise(resolve=>finish=resolve)});
 const pending=f.api.submit();await tick();
 assert.ok(visible(f));assert.match(status(f),/Sending/);assert.equal(f.get('[data-email-retry]').hidden,true);
 finish(new Response('{"ok":true,"confirmation_sent":true}'));await pending;
 assert.match(status(f),/on its way/);assert.ok(visible(f));assert.equal(f.get('[data-email-contact]').hidden,true);
});
test('partial email failure can retry without new diagnosis, AI request, or submission ID',async()=>{
 const calls=[];let ai=0;
 const f=tool({fetch:async(url,opts)=>{
   if(!url.includes('pb-forms')){ai++;throw new Error('AI mocked unavailable');}
   calls.push(Object.fromEntries(opts.body));
   return new Response(JSON.stringify({ok:true,confirmation_sent:calls.length>1}));
 }});
 f.api.state.answers.q3='https://example.invalid';
 await f.api.submit();assert.match(status(f),/received your result, but/);assert.equal(f.get('[data-email-retry]').hidden,false);
 const rec=f.get('[data-result-rec]').textContent;await f.api.sendEmail();
 assert.equal(ai,1);assert.equal(calls.length,2);assert.match(calls[0].next_step,/https:\/\/www\.plainblackcreative\.com\//);assert.deepEqual(calls[0],calls[1]);assert.equal(f.get('[data-result-rec]').textContent,rec);assert.match(status(f),/on its way/);
 await f.api.sendEmail();assert.equal(calls.length,2);
});
for(const [name,reply] of [
 ['HTTP error',()=>new Response('{"ok":true,"confirmation_sent":true}',{status:502})],
 ['rejected service',()=>new Response('{"ok":false}')],
 ['bad JSON',()=>new Response('bad')],
 ['null JSON',()=>new Response('null')],
 ['network error',()=>{throw new Error('offline');}]
]) test(name+' preserves diagnosis and offers retry',async()=>{
 const f=tool({fetch:async()=>reply()});await f.api.submit();assert.ok(visible(f));assert.match(status(f),/could not confirm/);assert.equal(f.get('[data-email-retry]').hidden,false);assert.equal(f.get('[data-email-contact]').hidden,false);
});
test('old service acknowledgment never claims visitor email sent or offers unsafe retry',async()=>{
 const f=tool({fetch:async()=>new Response('{"ok":true}')});await f.api.submit();assert.match(status(f),/could not confirm your email copy/);assert.equal(f.get('[data-email-retry]').hidden,true);assert.ok(visible(f));
});
test('double submits and concurrent retry clicks make one request',async()=>{
 let finish;let calls=0;const f=tool({fetch:()=>{calls++;return new Promise(resolve=>finish=resolve);}});
 const pending=f.api.submit();await f.api.submit();await tick();await f.api.sendEmail();await f.api.sendEmail();assert.equal(calls,1);
 finish(new Response('{"ok":true,"confirmation_sent":true}'));await pending;
});
test('timeout aborts and shows recoverable error',async()=>{
 const f=tool({fetch:(_,options)=>new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('aborted'))))});
 const pending=f.api.submit();await tick();const timer=[...f.timers.values()].find(t=>t.ms===20000);assert.ok(timer);timer.fn();await pending;
 assert.match(status(f),/could not confirm/);assert.ok(visible(f));assert.equal(f.get('[data-email-retry]').hidden,false);
});
test('restart ignores a late send response, resets state, and removes handoff',async()=>{
 let finish;const f=tool({fetch:()=>new Promise(resolve=>finish=resolve)});const pending=f.api.submit();await tick();f.api.restart();
 finish(new Response('{"ok":true,"confirmation_sent":true}'));await pending;
 assert.equal(visible(f),false);assert.equal(f.api.state.submitting,false);assert.equal(f.store.getItem(key),null);assert.doesNotMatch(status(f),/on its way/);
});
test('retry stops before provider idempotency expires',async()=>{
 let calls=0;const f=tool({fetch:async()=>{calls++;throw new Error('offline');}});await f.api.submit();f.advance(24*60*60*1000);await f.api.sendEmail();assert.equal(calls,1);assert.match(status(f),/expired/);assert.equal(f.get('[data-email-retry]').hidden,true);
});
test('handoff URL contains no personal details and contact consumes exact strings once',async()=>{
 const f=tool();const url=f.api.buildContactUrl({contactInterest:'website',recommendation:'Do <this> & that.'});
 assert.equal(url,'/contact?from=first-fix-clarity&interest=website&handoff=first-fix');
 const packet=JSON.parse(f.store.getItem(key));const c=fixture({store:f.store,search:new URL(url,'https://example.invalid').search});vm.runInContext(contact,c.context);
 assert.equal(c.get('#name').value,answers.name);assert.equal(c.get('#email').value,answers.email);assert.equal(c.get('#message').value,packet.message);assert.ok(c.get('#message').value.includes(answers.q5));assert.equal(c.get('#interest').value,'website');assert.equal(f.store.getItem(key),null);
 const again=fixture({store:f.store,search:c.context.location.search});vm.runInContext(contact,again.context);assert.match(again.get('#prefillBanner').innerHTML,/not available/);
});
for(const kind of ['expired','future','wrong source','invalid JSON','blocked','missing']) test(kind+' handoff falls back without URL PII',()=>{
 const store=storage();let packet={version:1,createdAt:Date.now(),from:'first-fix-clarity',name:answers.name,email:answers.email,message:answers.q5};
 if(kind==='expired')packet.createdAt-=31*60*1000;if(kind==='future')packet.createdAt+=60*1000;if(kind==='wrong source')packet.from='first-fix-ai';
 if(kind!=='missing')store.setItem(key,kind==='invalid JSON'?'broken':JSON.stringify(packet));
 if(kind==='blocked')store.getItem=()=>{throw new Error('blocked');};
 const c=fixture({store,search:'?from=first-fix-clarity&handoff=first-fix&name=MustNotRead&email=bad%40example.invalid&message=MustNotRead'});vm.runInContext(contact,c.context);
 assert.equal(c.get('#name').value,'');assert.equal(c.get('#email').value,'');assert.equal(c.get('#message').value,'');assert.match(c.get('#prefillBanner').innerHTML,/not available/);
});
test('blocked storage still renders diagnosis and offers a clean contact link',async()=>{
 const store=storage();store.setItem=()=>{throw new Error('blocked');};const f=tool({store});await f.api.submit();assert.ok(visible(f));assert.match(f.get('[data-email-contact]').href,/handoff=first-fix/);
});
test('handoff preserves a visitor edit and can be refreshed after Back',()=>{
 const f=tool();const url=f.api.buildContactUrl({recommendation:'Do this.'});const c=fixture({store:f.store,search:url.split('?')[1]});c.get('#name').value='Already edited';vm.runInContext(contact,c.context);assert.equal(c.get('#name').value,'Already edited');assert.equal(f.store.getItem(key),null);f.api.saveContactHandoff();assert.ok(f.store.getItem(key));
});
test('existing AI interest, brief, and quote-fit contact paths keep their behavior',()=>{
 for(const [search,interest,message] of [
 ['?interest=aitools&from=services-ai-tools','customtool',null],
 ['?interest=brief&from=briefs&briefId=local-test','brief','/tools/briefs?id=local-test'],
 ['?interest=quotefilter&from=quote-fit-filter&result=good&trade=roofing','quotefilter','Roofing']
 ]){const c=fixture({search});vm.runInContext(contact,c.context);assert.equal(c.get('#interest').value,interest);if(message)assert.ok(c.get('#message').value.includes(message));}
});
