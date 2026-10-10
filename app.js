import {validateBooking,filterProjects} from './domain.js';
import {BOOKING_ENDPOINT} from './config.js';

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let motionOff=motionQuery.matches;
function applyMotion(){
 document.body.classList.toggle('reduced-motion',motionOff);
 document.body.classList.toggle('js-motion',!motionOff);
 $('#motion-toggle').setAttribute('aria-pressed',String(motionOff));
 $('#motion-toggle').textContent=`Анимация: ${motionOff?'выключена':'включена'}`;
}
applyMotion();
$('#motion-toggle').addEventListener('click',()=>{motionOff=!motionOff;applyMotion();});
motionQuery.addEventListener('change',event=>{motionOff=event.matches;applyMotion();});

const services={
 polish:{title:'Глубина, которую видно.',copy:'Коррекция лакокрасочного покрытия. Удаление поверхностных дефектов и восстановление глубины цвета — с подбором метода после осмотра.',details:'Диагностика ЛКП · Подготовка поверхности · Контроль света',image:'detail',label:'Полировка кузова',cta:'Обсудить полировку',index:'01 / ПОЛИРОВКА',alt:'Деталь фары Porsche и отражения на кузове'},
 ceramic:{title:'Красота под защитой.',copy:'Керамический состав помогает облегчить регулярный уход и сохранить чистоту поверхности. Подготовка и подбор покрытия — по состоянию кузова.',details:'Подготовка ЛКП · Нанесение состава · Рекомендации по уходу',image:'night',label:'Керамическое покрытие',cta:'Обсудить керамику',index:'02 / КЕРАМИКА',alt:'Чёрный Porsche Boxster под ночным освещением'},
 ppf:{title:'Невидимая забота.',copy:'Защитная полиуретановая плёнка для уязвимых зон или кузова целиком. Схема оклейки определяется геометрией автомобиля и вашим режимом эксплуатации.',details:'Подбор зон · Подготовка кузова · Контроль кромок',image:'garage',label:'Защитная PPF-плёнка',cta:'Обсудить защиту',index:'03 / ПЛЁНКА',alt:'Porsche GT2 RS, форма заднего крыла'},
 interior:{title:'Пространство ваших чувств.',copy:'Деликатная работа с кожей, пластиком и декоративными поверхностями. Чтобы удовольствие от автомобиля начиналось ещё до движения.',details:'Осмотр материалов · Очистка деталей · Подбор защиты',image:'interior',label:'Детейлинг интерьера',cta:'Обсудить интерьер',index:'04 / ИНТЕРЬЕР',alt:'Интерьер Porsche, кожа и приборная панель'},
 clean:{title:'Чистота на глубину.',copy:'Очистка текстиля, ковров и труднодоступных участков. Способ обработки подбирается после проверки материала и характера загрязнений.',details:'Проверка состава · Локальная обработка · Контроль сушки',image:'interior',label:'Химчистка салона',cta:'Обсудить химчистку',index:'05 / ХИМЧИСТКА',alt:'Материалы салона Porsche'},
 restore:{title:'Сохранить прикосновение.',copy:'Работа с состоянием кожи и декоративных материалов. Возможность восстановления оценивается при осмотре, с учётом характера повреждений.',details:'Оценка состояния · Тест совместимости · Защитный уход',image:'detail',label:'Восстановление материалов',cta:'Обсудить восстановление',index:'06 / ВОССТАНОВЛЕНИЕ',alt:'Крупный план автомобильной поверхности'},
 complete:{title:'Каждая деталь. Вместе.',copy:'Согласованная программа ухода за кузовом и интерьером. Единый маршрут работы, составленный под ваш автомобиль и ваши ожидания.',details:'Диагностика · Программа работ · Финальный осмотр',image:'classic',label:'Комплексный детейлинг',cta:'Составить программу',index:'07 / КОМПЛЕКС',alt:'Классический Porsche 911 SC в Малибу'}
};
const imagePath=(name,size=1200)=>`assets/${name}-${size}.webp`;
const imageSizes={night:1600,classic:1600};
function chooseService(id,updateHash=false){
 if(!services[id])return;
 const service=services[id];
 $$('[data-service]').forEach(button=>{
  const active=button.dataset.service===id;
  button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;
 });
 $('#service-panel').setAttribute('aria-labelledby',`tab-${id}`);
 $('#service-title').textContent=service.title;$('#service-copy').textContent=service.copy;
 $('#service-details').textContent=service.details;$('#service-index').textContent=service.index;
 $('#service-photo').src=imagePath(service.image,imageSizes[service.image]||1200);$('#service-photo').alt=service.alt;
 $('#service-book').firstChild.textContent=service.cta+' ';
 $('#service-panel').classList.remove('montage');
 void $('#service-panel').offsetWidth;
 if(!motionOff)$('#service-panel').classList.add('montage');
 $('[name=service]').value=id;updateReceipt();
 if(updateHash)history.replaceState(null,'',`#service-${id}`);
}
$$('[data-service]').forEach((button,index,buttons)=>{
 button.addEventListener('click',()=>chooseService(button.dataset.service,true));
 button.addEventListener('keydown',event=>{
  let next;
  if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%buttons.length;
  if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index+buttons.length-1)%buttons.length;
  if(event.key==='Home')next=0;if(event.key==='End')next=buttons.length-1;
  if(next===undefined)return;
  event.preventDefault();buttons[next].focus();chooseService(buttons[next].dataset.service,true);
 });
});
function readServiceHash(){const id=location.hash.replace('#service-','');if(services[id]){chooseService(id);$('#services').scrollIntoView({behavior:motionOff?'instant':'smooth'});}}
window.addEventListener('hashchange',readServiceHash);

const constellation=$('#constellation');
const navigationOpeners=$$('#explore,#hero-explore');
navigationOpeners.forEach(button=>button.addEventListener('click',()=>{constellation.showModal();navigationOpeners.forEach(opener=>opener.setAttribute('aria-expanded','true'));}));
constellation.addEventListener('close',()=>{navigationOpeners.forEach(opener=>opener.setAttribute('aria-expanded','false'));});
$$('dialog').forEach(dialog=>{
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
});
$$('.constellation nav a').forEach(link=>{
 function preview(){$('#nav-preview-photo').src=imagePath(link.dataset.preview,imageSizes[link.dataset.preview]||1200);}
 link.addEventListener('pointerenter',preview);link.addEventListener('focus',preview);
 link.addEventListener('click',event=>{
  event.preventDefault();constellation.close();const target=$(link.getAttribute('href'));
  history.pushState(null,'',link.getAttribute('href'));target.scrollIntoView({behavior:motionOff?'instant':'smooth'});
  const heading=target.querySelector('h2,h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
 });
});

const projects=[
 {id:'classic',category:'exterior',title:'Porsche 911 SC',image:'classic',alt:'Бордовый классический Porsche 911 SC в Малибу',info:'Вневременные пропорции. Фотография Tyler Clemmensen, Малибу. Редакционная подборка, не выполненная работа ATELIER.',source:'https://unsplash.com/photos/black-porsche-911-on-road-during-daytime-9O1TtEwVits'},
 {id:'interior',category:'interior',title:'Внутренний мир',image:'interior',alt:'Интерьер Porsche с кожей и приборной панелью',info:'Тактильная сторона автомобильного дизайна. Фотография Spenser Sembrat. Редакционная подборка, не выполненная работа ATELIER.',source:'https://unsplash.com/photos/the-interior-of-a-car-zNh3Brge2pI'},
 {id:'garage',category:'exterior',title:'Porsche GT2 RS',image:'garage',alt:'Porsche GT2 RS в гараже, задний ракурс',info:'Свет, геометрия и характер. Фотография LOGAN WEAVER. Редакционная подборка, не выполненная работа ATELIER.',source:'https://unsplash.com/photos/black-porsche-911-parked-in-garage-k8xzU9UlsTM'},
 {id:'detail',category:'exterior',title:'Язык отражений',image:'detail',alt:'Фара Porsche с отражениями',info:'Крупный план дизайна и отражений. Фотография Madeline Liu. Редакционная подборка, не выполненная работа ATELIER.',source:'https://unsplash.com/photos/a-close-up-view-of-a-car-headlight-5L8pYV2QGXU'}
];
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const ids=filterProjects(projects,button.dataset.filter).map(item=>item.id);
 $$('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 $$('[data-project]').forEach(item=>{item.hidden=!ids.includes(item.dataset.project);});
 $('.gallery-grid').classList.toggle('filtered',button.dataset.filter!=='all');
}));
$$('[data-project]').forEach(button=>button.addEventListener('click',()=>{
 const project=projects.find(item=>item.id===button.dataset.project);
 $('#project-full').src=imagePath(project.image,imageSizes[project.image]||1200);
 $('#project-full').alt=project.alt;$('#project-title').textContent=project.title;
 $('#project-info').textContent=project.info;$('#project-source').href=project.source;
 $('#project-dialog').showModal();
}));

const experience=[
 ['01 / ДИАЛОГ','Расскажите о модели, состоянии и ваших ожиданиях. Вместе определим, что действительно нужно автомобилю.'],
 ['02 / ПЛАН','После осмотра согласуем состав работ, подходящие материалы, сроки и стоимость. Все решения — до начала процесса.'],
 ['03 / РАБОТА','Работа идёт по согласованному маршруту: подготовка, обработка, защита и контроль. Внимание остаётся на каждой детали.'],
 ['04 / ВСТРЕЧА','Совместный осмотр автомобиля и рекомендации по дальнейшему уходу. Чтобы результат оставался частью ежедневного удовольствия.']
];
$$('[data-experience]').forEach(button=>button.addEventListener('click',()=>{
 const [index,copy]=experience[Number(button.dataset.experience)];
 $$('[data-experience]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 $('#experience-index').textContent=index;$('#experience-copy').textContent=copy;
}));

const form=$('#booking-form');
form.querySelector('[type=submit]').disabled=false;
function updateReceipt(){$('#receipt-service').textContent=services[form.elements.service.value]?.label||'Услуга ещё не выбрана';}
form.elements.service.addEventListener('change',updateReceipt);
if(BOOKING_ENDPOINT){$('#submit-label').textContent='Отправить заявку';$('.demo-notice').textContent='Заявка передаётся в сервис приёма обращений. Перед отправкой убедитесь, что согласны передать указанные контактные данные.';$('.form-footnote').textContent='Нажимая «Отправить заявку», вы передаёте указанные данные для связи по вашему обращению.';}
form.addEventListener('submit',async event=>{
 event.preventDefault();
 if(form.querySelector('[type=submit]').disabled)return;
 const data=Object.fromEntries(new FormData(form));const errors=validateBooking(data);
 for(const field of ['name','phone','car','service']){$(`#error-${field}`).textContent=errors[field]||'';form.elements[field].setAttribute('aria-invalid',String(Boolean(errors[field])));}
 if(Object.keys(errors).length){form.elements[Object.keys(errors)[0]].focus();$('#form-status').textContent='Проверьте отмеченные поля.';return;}
 if(!BOOKING_ENDPOINT){$('#form-status').textContent='Данные заполнены корректно. Это деморежим: заявка не отправлена. Для записи владельцу сайта нужно подключить приём обращений.';return;}
 const button=form.querySelector('[type=submit]');button.disabled=true;$('#submit-label').textContent='Отправляем…';$('#form-status').textContent='';
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 try{
  const endpoint=new URL(BOOKING_ENDPOINT,location.href);
  if(endpoint.protocol!=='https:'&&endpoint.origin!==location.origin)throw new Error('Unsafe endpoint');
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});
  if(!response.ok)throw new Error('Request failed');
  const result=await response.json();if(result.success!==true)throw new Error('Not accepted');
  $('#form-status').textContent='Заявка получена. Мы свяжемся с вами по указанному телефону.';form.reset();updateReceipt();
 }catch{$('#form-status').textContent='Не удалось подтвердить отправку. Данные остались в форме. Попробуйте ещё раз позже.';}
 finally{clearTimeout(timeout);button.disabled=false;$('#submit-label').textContent='Отправить заявку';}
});

// Observe unclipped containers: an entirely clipped heading cannot intersect.
const revealTargets=new Map();
$$('.reveal,.aperture').forEach(item=>{const container=item.parentElement;revealTargets.set(container,[...(revealTargets.get(container)||[]),item]);});
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){revealTargets.get(entry.target).forEach(item=>item.classList.add('visible'));revealObserver.unobserve(entry.target);}}),{threshold:.12});
revealTargets.forEach((_targets,container)=>revealObserver.observe(container));
const chaptersObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(!entry.isIntersecting)return;
 $$('.constellation nav a,.header-nav a').forEach(link=>{if(link.getAttribute('href')===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
}),{rootMargin:'-15% 0px -60% 0px'});
$$('main section[id]').forEach(section=>chaptersObserver.observe(section));
const craftObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(!entry.isIntersecting)return;const step=Number(entry.target.dataset.step);
 $('#dial-number').textContent=`0${step}`;$('.dial-value').style.strokeDashoffset=String(553*(1-step/3));
}),{rootMargin:'-20% 0px -35% 0px',threshold:0});
$$('[data-step]').forEach(item=>craftObserver.observe(item));
let scrollFrame=0;
function updateScroll(){scrollFrame=0;const height=document.documentElement.scrollHeight-innerHeight;const progress=height>0?scrollY/height:0;$('.scroll-progress').style.transform=`scaleX(${progress})`;}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});updateScroll();
readServiceHash();
