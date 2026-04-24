(function(){
  'use strict';
  var PHONES={
    ian:{display:[48,52,53,56,32,53,52,49,32,53,51,56],tel:[43,54,49,52,53,56,53,52,49,53,51,56]},
    jayden:{display:[48,50,55,32,53,51,51,32,50,57,55,48],tel:[43,54,52,50,55,53,51,51,50,57,55,48]}
  };
  function decode(arr){return arr.map(function(c){return String.fromCharCode(c);}).join('');}
  function reduced(){return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
  function reveal(btn){
    var key=btn.getAttribute('data-pb-reveal');
    var p=PHONES[key];if(!p)return;
    var display=decode(p.display);
    var tel=decode(p.tel);
    var labelEl=btn.querySelector('.reveal-phone__label');
    if(!labelEl)return;
    btn.setAttribute('data-pb-revealed','true');
    btn.setAttribute('aria-label','Call '+tel);
    if(reduced()){
      labelEl.textContent=display;
      btn.onclick=function(){window.location.href='tel:'+tel;};
      return;
    }
    var chars=display.split('');
    var locked={};
    chars.forEach(function(c,i){if(c===' ')locked[i]=true;});
    var tick=setInterval(function(){
      var out=chars.map(function(c,i){return locked[i]?c:Math.floor(Math.random()*10).toString();});
      labelEl.textContent=out.join('');
    },50);
    var toLock=[];
    chars.forEach(function(c,i){if(c!==' ')toLock.push(i);});
    toLock.forEach(function(idx,order){
      setTimeout(function(){
        locked[idx]=true;
        var out=chars.map(function(c,i){return locked[i]?c:Math.floor(Math.random()*10).toString();});
        labelEl.textContent=out.join('');
        if(order===toLock.length-1){
          clearInterval(tick);
          labelEl.textContent=display;
          btn.onclick=function(){window.location.href='tel:'+tel;};
          btn.classList.add('reveal-phone--pulsed');
          setTimeout(function(){btn.classList.remove('reveal-phone--pulsed');},600);
        }
      },80*(order+1));
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    var buttons=document.querySelectorAll('.reveal-phone');
    Array.prototype.forEach.call(buttons,function(btn){
      btn.addEventListener('click',function(e){
        if(btn.getAttribute('data-pb-revealed')==='true')return;
        e.preventDefault();
        reveal(btn);
      });
    });
  });
})();
