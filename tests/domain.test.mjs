import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateBooking, filterProjects} from '../domain.js';
test('rejects whitespace names, invalid phone and missing car or service',()=>{
 const errors=validateBooking({name:' ',phone:'123',car:'',service:''});
 assert.deepEqual(Object.keys(errors),['name','phone','car','service']);
});
test('accepts formatted Russian and international numbers',()=>{
 assert.deepEqual(validateBooking({name:'Анна',phone:'+7 (999) 123-45-67',car:'Porsche 911',service:'ceramic'}),{});
 assert.deepEqual(validateBooking({name:'Анна',phone:'+49 151 23456789',car:'911',service:'ppf'}),{});
});
test('rejects punctuation-only phone and unknown service',()=>{
 assert.ok(validateBooking({name:'Анна',phone:'+7abcdef123456789',car:'911',service:'fake'}).phone);
 assert.ok(validateBooking({name:'Анна',phone:'+79991234567',car:'911',service:'fake'}).service);
});
test('filters real project categories and returns all for all',()=>{
 const items=[{category:'exterior'},{category:'interior'}];
 assert.equal(filterProjects(items,'exterior').length,1);
 assert.equal(filterProjects(items,'all').length,2);
 assert.equal(filterProjects(items,'unknown').length,0);
});
