export function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

export function lerpWaypoints(way, sy) {
  if (!way || !way.length) return null;
  if (sy <= way[0].at) return way[0];
  for (let i = 0; i < way.length - 1; i++) {
    const a = way[i], b = way[i + 1];
    if (sy >= a.at && sy <= b.at) {
      const t = smoothstep((sy - a.at) / Math.max(1, b.at - a.at));
      const L = (k) => a[k] + (b[k] - a[k]) * t;
      return { x: L('x'), y: L('y'), s: L('s'), o: L('o'), rs: L('rs') };
    }
  }
  return way[way.length - 1];
}

export function buildWaypoints({ vh, end, top, mobile }) {
  if (mobile) {
    return [
      { at: 0,                        x: 0, y: 1.26, s: .46, o: .7,  rs: .20 },
      { at: vh * .9,                  x: 0, y: 1.5,  s: .4,  o: .4,  rs: .32 },
      { at: top('despre'),            x: 0, y: 1.45, s: .42, o: .28, rs: .45 },
      { at: top('contact') - vh * .6, x: 0, y: 1.45, s: .42, o: .25, rs: .45 },
      { at: top('contact') - vh * .1, x: 0, y: .95,  s: .56, o: .85, rs: .26 },
      { at: end,                      x: 0, y: .75,  s: .62, o: 1,   rs: .24 },
    ];
  }
  return [
    { at: 0,                          x: 1.45,  y: 0,    s: 1.0, o: 1,   rs: .18 },
    { at: vh * .85,                   x: 1.55,  y: .18,  s: .92, o: 1,   rs: .22 },
    { at: top('despre') - vh * .15,   x: -1.62, y: -.05, s: .58, o: .9,  rs: .32 },
    { at: top('proiecte') - vh * .15, x: 1.95,  y: .25,  s: .46, o: .40, rs: .50 },
    { at: top('viitor') - vh * .15,   x: -1.95, y: .10,  s: .42, o: .32, rs: .55 },
    { at: top('contact') - vh * .15,  x: 1.35,  y: -.05, s: .88, o: .95, rs: .25 },
    { at: end,                        x: 1.35,  y: .35,  s: .96, o: 1,   rs: .22 },
  ];
}

export function formatClock(date, lang = 'ro') {
  const prefix = lang === 'en' ? 'NETHERLANDS — ' : 'OLANDA — ';
  const locale = lang === 'en' ? 'en-GB' : 'ro-RO';
  try {
    return prefix + date.toLocaleTimeString(locale, { timeZone: 'Europe/Amsterdam', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return prefix + date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
}

export function countUpStep(target) {
  return Math.max(1, Math.ceil(target / 28));
}
