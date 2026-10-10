export const serviceIds=['polish','ceramic','ppf','interior','clean','restore','complete'];
export function validateBooking(data){
 const errors={};
 if(!data.name?.trim() || data.name.trim().length<2) errors.name='Укажите имя, минимум 2 символа';
 const phone=data.phone?.trim()||'';
 const digits=phone.replace(/\D/g,'');
 if(!/^\+?[\d\s()\-]+$/.test(phone)||digits.length<10||digits.length>15) errors.phone='Введите телефон с кодом страны';
 if(!data.car?.trim()) errors.car='Укажите марку и модель автомобиля';
 if(!serviceIds.includes(data.service)) errors.service='Выберите услугу';
 return errors;
}
export function filterProjects(items,category){return category==='all'?items:items.filter(item=>item.category===category);}
