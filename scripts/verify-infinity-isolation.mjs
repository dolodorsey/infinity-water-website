import { readFileSync } from 'node:fs';

const routePath = new URL('../src/app/api/forms/route.js', import.meta.url);
const source = readFileSync(routePath, 'utf8');

const checks = [
  {
    ok: source.includes("const INTAKE_TABLE = 'infinity_quote_requests'"),
    message: 'Infinity intake must use the dedicated infinity_quote_requests table.',
  },
  {
    ok: source.includes("const ASSIGNED_TEAM = 'Infinity Water Sales'"),
    message: 'Infinity intake must remain assigned to the Infinity Water Sales team.',
  },
  {
    ok: !source.includes('/rest/v1/quote_requests'),
    message: 'Infinity must not write website leads to the shared quote_requests table.',
  },
  {
    ok: !/\b(pronto|aquifer|nativa|medicine|tribal|trailblazers|university)\b/i.test(source),
    message: 'Infinity form code must not reference another Water Portfolio brand.',
  },
];

const failures = checks.filter((check) => !check.ok);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure.message}`);
  process.exit(1);
}

console.log('Infinity Water isolation contract verified.');
