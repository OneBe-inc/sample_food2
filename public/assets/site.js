(() => {
 'use strict';
 const toggle=document.querySelector('.menu-toggle');
 const nav=document.getElementById('site-nav');
 let savedScroll=0;
 function setMenu(open){toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');nav.classList.toggle('is-open',open);nav.inert=!open;if(open){savedScroll=window.scrollY;document.body.style.position='fixed';document.body.style.width='100%';document.body.style.top=`-${savedScroll}px`;}else{document.body.style.position='';document.body.style.width='';document.body.style.top='';window.scrollTo({top:savedScroll,behavior:'instant'});}}
 toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
 document.addEventListener('keydown',e=>{if(toggle.getAttribute('aria-expanded')!=='true')return;if(e.key==='Escape'){setMenu(false);toggle.focus();}if(e.key==='Tab'){const nodes=[toggle,...nav.querySelectorAll('a,button')];if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus();}}});
 const dialog=document.querySelector('.dialog');
 const messages={reserve:['ご予約について','こちらは架空の鉄板焼き店「サンプル」のデモサイトです。現在、ご予約・お問い合わせは受け付けておりません。'],recruit:['採用について','こちらはサンプルの採用ページです。現在、スタッフの募集・応募受付は行っておりません。'], 'news-open':['ウェブサイトを公開しました。','サンプルのウェブサイトをご覧いただき、ありがとうございます。鉄板料理の楽しさと、心地よいお店の時間をイメージしたデモサイトです。'], 'news-menu':['季節を楽しむ、おまかせコース。','旬の前菜、魚介、赤身ステーキからデザートまで。おまかせコースは、お一人様5,500円のサンプルメニューとしてご紹介しています。お品書きの「コース」タブをご覧ください。']};
 document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>{const [title,text]=messages[button.dataset.dialog];document.getElementById('dialog-title').textContent=title;const p=document.createElement('p');for(const part of text.split(/(\d+(?:[.,:/-]\d+)*)/g)){if(/^\d/.test(part)){const span=document.createElement('span');span.className='numeric';span.textContent=part;p.append(span);}else p.append(document.createTextNode(part));}document.getElementById('dialog-body').replaceChildren(p);dialog.showModal();}));
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
 document.querySelectorAll('[role=tablist]').forEach(list=>{const tabs=[...list.querySelectorAll('[role=tab]')];function activate(tab,focus=false){tabs.forEach(t=>{const current=t===tab;t.setAttribute('aria-selected',String(current));t.tabIndex=current?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!current;});if(focus)tab.focus();}tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activate(tabs[next],true);}});});});
 const scenes=[...document.querySelectorAll('.scene-image')];
 const sections=[...document.querySelectorAll('[data-background]')];
 let pending=false;
 function updateScene(){pending=false;let current=sections[0]?.dataset.background||'steak';for(const section of sections)if(section.getBoundingClientRect().top<=innerHeight*.45)current=section.dataset.background;scenes.forEach((scene,i)=>{const active=scene.dataset.scene===current;scene.classList.toggle('is-current',active);if(active)document.getElementById('scene-number').textContent=String(i+1).padStart(2,'0');});}
 window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateScene);}},{passive:true});updateScene();
})();
