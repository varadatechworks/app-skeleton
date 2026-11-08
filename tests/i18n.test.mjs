import test from 'node:test';import assert from 'node:assert/strict';
import {translate,baselineMessages} from '../modules/i18n/index.mjs';
test('Kannada translations and English fallback',()=>{assert.equal(translate(baselineMessages,'kn','save'),'ಉಳಿಸಿ');assert.equal(translate(baselineMessages,'de','save'),'Save');assert.equal(translate(baselineMessages,'kn','nonexistent'),'nonexistent');assert.equal(translate({en:{hello:'Hello {name}'}},'en','hello',{name:'A'}),'Hello A');});
