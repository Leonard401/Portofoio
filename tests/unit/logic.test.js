import { describe, it, expect } from 'vitest';
import { smoothstep, lerpWaypoints, buildWaypoints, formatClock, countUpStep } from '../../js/logic.js';

describe('smoothstep', () => {
  it('clamps endpoints', () => {
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
  });

  it('eases the midpoint to 0.5', () => {
    expect(smoothstep(0.5)).toBeCloseTo(0.5);
  });
});

describe('lerpWaypoints', () => {
  const way = [
    { at: 0,   x: 0,  y: 0,  s: 1, o: 1, rs: .2 },
    { at: 100, x: 10, y: 20, s: 2, o: 0, rs: .4 },
  ];

  it('returns the first waypoint before the range starts', () => {
    expect(lerpWaypoints(way, -50)).toEqual(way[0]);
  });

  it('returns the last waypoint after the range ends', () => {
    expect(lerpWaypoints(way, 500)).toEqual(way[1]);
  });

  it('interpolates between two waypoints with easing', () => {
    const mid = lerpWaypoints(way, 50);
    expect(mid.x).toBeCloseTo(5, 5);
    expect(mid.s).toBeCloseTo(1.5, 5);
    expect(mid.o).toBeCloseTo(0.5, 5);
  });

  it('returns null for an empty waypoint list', () => {
    expect(lerpWaypoints([], 10)).toBeNull();
  });

  it('does not divide by zero when two waypoints share the same "at"', () => {
    const flat = [{ at: 10, x: 0, y: 0, s: 1, o: 1, rs: 0 }, { at: 10, x: 5, y: 5, s: 2, o: 0, rs: 1 }];
    expect(() => lerpWaypoints(flat, 10)).not.toThrow();
  });
});

describe('buildWaypoints', () => {
  const top = (id) => ({ despre: 800, proiecte: 1600, viitor: 2400, contact: 3200 }[id] ?? 0);

  it('builds the mobile path with 6 waypoints starting at 0 and ending at "end"', () => {
    const way = buildWaypoints({ vh: 800, end: 4000, top, mobile: true });
    expect(way).toHaveLength(6);
    expect(way[0].at).toBe(0);
    expect(way[way.length - 1].at).toBe(4000);
  });

  it('builds the desktop path with 7 waypoints anchored to section offsets', () => {
    const way = buildWaypoints({ vh: 800, end: 4000, top, mobile: false });
    expect(way).toHaveLength(7);
    expect(way[2].at).toBe(top('despre') - 800 * 0.15);
    expect(way[way.length - 1].at).toBe(4000);
  });

  it('keeps waypoints in non-decreasing "at" order for a typical layout', () => {
    const way = buildWaypoints({ vh: 800, end: 4000, top, mobile: false });
    for (let i = 1; i < way.length; i++) {
      expect(way[i].at).toBeGreaterThanOrEqual(way[i - 1].at);
    }
  });
});

describe('formatClock', () => {
  const date = new Date('2024-01-01T12:30:00Z');

  it('defaults to the Romanian prefix and locale', () => {
    expect(formatClock(date)).toMatch(/^OLANDA — \d{2}:\d{2}$/);
  });

  it('switches to the English prefix when lang is "en"', () => {
    expect(formatClock(date, 'en')).toMatch(/^NETHERLANDS — \d{2}:\d{2}$/);
  });
});

describe('countUpStep', () => {
  it('never returns a step below 1', () => {
    expect(countUpStep(0)).toBe(1);
    expect(countUpStep(1)).toBe(1);
  });

  it('scales with the target so the animation takes about 28 ticks', () => {
    expect(countUpStep(9)).toBe(1);
    expect(countUpStep(280)).toBe(10);
  });
});
