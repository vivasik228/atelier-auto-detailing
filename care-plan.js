export const serviceLabels={polish:'Полировка кузова',ceramic:'Керамическое покрытие',ppf:'Защитная PPF-плёнка',interior:'Детейлинг интерьера',clean:'Химчистка салона',restore:'Восстановление материалов',complete:'Комплексный детейлинг'};
export const zoneLabels={bumper:'Передний бампер',hood:'Капот',mirrors:'Зеркала',fenders:'Передние крылья',sills:'Пороги',roof:'Крыша'};
export const programs={new:{services:['ppf','ceramic'],zones:['bumper','hood','mirrors']},used:{services:['polish','clean'],zones:[]},sale:{services:['polish','interior'],zones:[]}};
export function normalizePlan(input={}){
 const services=[...new Set((Array.isArray(input.services)?input.services:[]).filter(id=>Object.hasOwn(serviceLabels,id)))];
 const zones=[...new Set((Array.isArray(input.zones)?input.zones:[]).filter(id=>Object.hasOwn(zoneLabels,id)))];
 if(zones.length&&!services.includes('ppf'))services.push('ppf');
 return {services,zones};
}
export function formatPlan(input={}){
 const plan=normalizePlan(input);const answers=input.answers||{};
 const lines=['ATELIER / ПЛАН УХОДА','Состав для обсуждения, не расчёт стоимости.'];
 if(input.car?.trim())lines.push('Автомобиль: '+input.car.trim());
 lines.push('','Выбранные работы:',...plan.services.map(id=>'— '+serviceLabels[id]));
 if(!plan.services.length)lines.push('Услуги ещё не выбраны.');
 if(plan.zones.length)lines.push('','Зоны PPF:',...plan.zones.map(id=>'— '+zoneLabels[id]));
 for(const [key,label] of [['storage','Хранение'],['use','Эксплуатация'],['concern','Что беспокоит']])if(answers[key]?.trim())lines.push(label+': '+answers[key].trim());
 if(input.comment?.trim())lines.push('Пожелания: '+input.comment.trim());
 lines.push('','Стоимость, совместимость работ и сроки согласуются после осмотра.');
 return lines.join('\n');
}
