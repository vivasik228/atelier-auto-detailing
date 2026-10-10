import {serviceLabels,zoneLabels,programs,normalizePlan,formatPlan} from './care-plan.js';
import {serviceGuides} from './service-guide.js';

export function initPlanner({chooseService,getCurrentService}){
 const $=selector=>document.querySelector(selector);
 const $$=selector=>[...document.querySelectorAll(selector)];
 const form=$('#booking-form');
 let plan={services:[],zones:[]};let current=getCurrentService();let hasSelection=false;let bookingVisible=false;
 const mobile=$('#mobile-plan-cta');
 function download(text,filename){
  const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function getPayload(){
  const chosen=normalizePlan(plan);
  if(!chosen.services.length&&serviceLabels[form.elements.service.value])chosen.services.push(form.elements.service.value);
  return {...chosen,car:form.elements.car.value,comment:form.elements.comment.value,answers:{storage:form.elements.storage.value,use:form.elements.usage.value,concern:form.elements.concern.value}};
 }
 function mobileState(){
  mobile.hidden=!hasSelection||bookingVisible;
  mobile.querySelector('span').textContent=plan.services.length>1?'Обсудить план · '+plan.services.length:('Обсудить: '+serviceLabels[plan.services[0]||form.elements.service.value||current]);
 }
 function render(syncPrimary=true){
  plan=normalizePlan(plan);
  $$('[data-plan-service]').forEach(input=>{input.checked=plan.services.includes(input.dataset.planService);});
  $$('[data-zone-input]').forEach(input=>{input.checked=plan.zones.includes(input.dataset.zoneInput);});
  $$('[data-zone]').forEach(zone=>zone.setAttribute('aria-pressed',String(plan.zones.includes(zone.dataset.zone))));
  $('#plan-count').textContent=String(plan.services.length);
  const works=plan.services.map(id=>serviceLabels[id]).join(' · ');
  const areas=plan.zones.map(id=>zoneLabels[id]).join(', ');
  const summary=works+(areas?' / Зоны: '+areas:'');
  $('#plan-summary').textContent=summary||'Пока ничего не выбрано.';
  $('#booking-plan-summary').textContent=summary||'Можно выбрать несколько работ в разделе услуг.';
  for(const id of ['plan-download','plan-copy'])$('#'+id).disabled=!plan.services.length;
  $('#plan-clear').disabled=!plan.services.length&&!plan.zones.length;
  if(syncPrimary&&plan.services.length&&!plan.services.includes(form.elements.service.value))chooseService(plan.services[0],true);
  $('#service-add-plan').textContent=plan.services.includes(current)?'Убрать из плана −':'Добавить в план +';
  mobileState();
 }
 function changed(message){hasSelection=Boolean(plan.services.length||form.elements.service.value);$$('[data-program]').forEach(button=>button.setAttribute('aria-pressed','false'));render();$('#plan-status').textContent=message;}
 function toggleZone(id){
  plan.zones=plan.zones.includes(id)?plan.zones.filter(zone=>zone!==id):[...plan.zones,id];
  changed((plan.zones.includes(id)?'Добавлена зона: ':'Убрана зона: ')+zoneLabels[id]);
 }
 $$('[data-zone]').forEach(zone=>{
  zone.addEventListener('click',()=>toggleZone(zone.dataset.zone));
  zone.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleZone(zone.dataset.zone);}});
 });
 $$('[data-zone-input]').forEach(input=>input.addEventListener('change',()=>toggleZone(input.dataset.zoneInput)));
 function toggleService(id){
  const removing=plan.services.includes(id);
  plan.services=removing?plan.services.filter(service=>service!==id):[...plan.services,id];
  if(removing&&id==='ppf')plan.zones=[];
  changed((removing?'Убрано: ':'Добавлено: ')+serviceLabels[id]);
 }
 $$('[data-plan-service]').forEach(input=>input.addEventListener('change',()=>toggleService(input.dataset.planService)));
 $('#service-add-plan').addEventListener('click',()=>toggleService(current));
 $$('[data-program]').forEach(button=>button.addEventListener('click',()=>{
  const program=programs[button.dataset.program];plan={services:[...program.services],zones:[...program.zones]};hasSelection=true;render();
  $$('[data-program]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  $('#plan-status').textContent='Программа выбрана. Можно изменить услуги и зоны.';
 }));
 $('#plan-clear').addEventListener('click',()=>{plan={services:[],zones:[]};changed('План очищен.');});
 const downloadPlan=()=>{download(formatPlan(getPayload()),'ATELIER-план-ухода.txt');$('#plan-status').textContent='План сохранён в текстовый файл.';};
 $('#plan-download').addEventListener('click',downloadPlan);
 $('#booking-plan-download').addEventListener('click',downloadPlan);
 $('#plan-copy').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(formatPlan(getPayload()));$('#plan-status').textContent='План скопирован.';}
  catch{$('#plan-status').textContent='Браузер не разрешил копирование. Используйте «Скачать план».';}
 });
 $('#care-download').addEventListener('click',()=>{
  const guide=serviceGuides[current];
  download(['ATELIER / ПАМЯТКА ПО УХОДУ',serviceLabels[current],'',guide.care,'','Уточните режим ухода для применённых материалов при выдаче автомобиля.','Источники:','https://www.xpel.com/product-care','https://gtechniq.com/how-to-wash-a-ceramic-coated-car/'].join('\n'),'ATELIER-уход-'+current+'.txt');
 });
 $('#service-zoom-open').addEventListener('click',()=>{
  const image=$('#service-photo');$('#zoom-photo').src=image.currentSrc||image.src;$('#zoom-photo').alt=image.alt;$('#zoom-title').textContent=image.alt;$('#service-zoom').showModal();
 });
 for(const anchor of [$('#service-book'),$('.task-result .text-link')])anchor.addEventListener('click',()=>{
  if(!plan.services.includes(current))plan.services.push(current);
  hasSelection=true;chooseService(current,false);render(false);
  $('#plan-status').textContent='Услуга добавлена в план для обсуждения.';
 });
 for(const anchor of [$('#plan-book'),mobile])anchor.addEventListener('click',()=>{
  if(plan.services.length&&!plan.services.includes(form.elements.service.value))chooseService(plan.services[0],false);
 });
 form.elements.service.addEventListener('change',()=>{
  const id=form.elements.service.value;
  if(serviceLabels[id]){
   if(plan.services.length&&!plan.services.includes(id))plan.services.push(id);
   chooseService(id,false);render(false);
  }
  hasSelection=Boolean(id||plan.services.length);mobileState();
 });
 new IntersectionObserver(entries=>{bookingVisible=entries[0].isIntersecting;mobileState();},{threshold:0}).observe($('#booking'));
 render(false);
 return {
  setCurrentService(id){current=id;hasSelection=true;$('#service-add-plan').textContent=plan.services.includes(id)?'Убрать из плана −':'Добавить в план +';mobileState();},
  getPayload,
  hasWorks:()=>plan.services.length>0,
  includes:id=>plan.services.includes(id),
  reset(){plan={services:[],zones:[]};hasSelection=false;$$('[data-program]').forEach(button=>button.setAttribute('aria-pressed','false'));render(false);}
 };
}
