import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizePlan,formatPlan} from '../care-plan.js';

test('normalizes duplicates and rejects unknown services and zones',()=>{
 assert.deepEqual(normalizePlan({services:['polish','fake','polish'],zones:['hood','invalid','hood']}),{services:['polish','ppf'],zones:['hood']});
 assert.deepEqual(normalizePlan({}),{services:[],zones:[]});
});
test('exports multiple works, selected zones and questionnaire without contact fields',()=>{
 const text=formatPlan({services:['clean','ppf'],zones:['bumper'],car:'Porsche 911',answers:{storage:'Гараж',use:'Ежедневно'},phone:'+79991234567',name:'Private name'});
 assert.match(text,/Химчистка салона/);assert.match(text,/Защитная PPF-плёнка/);assert.match(text,/Передний бампер/);assert.match(text,/Гараж/);assert.match(text,/Porsche 911/);
 assert.doesNotMatch(text,/79991234567|Private name|undefined/);
});
