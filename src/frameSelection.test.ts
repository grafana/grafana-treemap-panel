import { FieldType } from '@grafana/data';

import { buildFrameViews, fieldMatches, normalize } from './frameSelection';
import { TreemapOptions } from './types';

const makeOptions = (overrides: Partial<TreemapOptions> = {}): TreemapOptions => {
  return {
    tiling: 'treemapSquarify',
    textField: '',
    sizeField: '',
    colorByField: '',
    labelFields: [],
    groupByField: '',
    ...overrides,
  };
};

const makeField = (overrides: any) => {
  return {
    name: 'field',
    type: FieldType.string,
    values: { get: () => undefined },
    config: {},
    state: {},
    ...overrides,
  };
};

describe('frameSelection', () => {
  test('normalize trims and handles undefined', () => {
    expect(normalize(undefined)).toBe('');
    expect(normalize('  a  ')).toBe('a');
  });

  test('fieldMatches checks name and display name variants', () => {
    const f = makeField({
      name: 'Value #A',
      config: { displayName: 'debt_days', displayNameFromDS: 'debt_days_ds' },
      state: { displayName: 'debt_days_state' },
    });

    expect(fieldMatches(f as any, 'Value #A')).toBe(true);
    expect(fieldMatches(f as any, 'debt_days')).toBe(true);
    expect(fieldMatches(f as any, 'debt_days_ds')).toBe(true);
    expect(fieldMatches(f as any, 'debt_days_state')).toBe(true);

    expect(fieldMatches(f as any, 'missing')).toBe(false);
    expect(fieldMatches(f as any, '')).toBe(false);
    expect(fieldMatches(f as any, '   ')).toBe(false);
  });

  test('buildFrameViews selects by displayName when field.name differs', () => {
    const series = [
      {
        name: 'A',
        refId: 'A',
        fields: [
          makeField({ name: 'project_key', type: FieldType.string, config: { displayName: 'project_key' } }),
          makeField({ name: 'Value', type: FieldType.number, config: { displayName: 'debt_days' } }),
        ],
      },
    ];

    const options = makeOptions({
      textField: 'project_key',
      sizeField: 'debt_days',
      colorByField: '',
    });

    const frames = buildFrameViews(series as any, options);
    expect(frames).toHaveLength(1);
    expect(frames[0].text?.name).toBe('project_key');
    expect(frames[0].size?.name).toBe('Value');
    // colorByField unset => uses size
    expect(frames[0].color?.name).toBe('Value');
  });

  test('buildFrameViews rejects frame when colorByField is explicitly set but not found', () => {
    const series = [
      {
        name: 'A',
        refId: 'A',
        fields: [
          makeField({ name: 'project_key', type: FieldType.string }),
          makeField({ name: 'debt_days', type: FieldType.number }),
        ],
      },
    ];

    const options = makeOptions({
      textField: 'project_key',
      sizeField: 'debt_days',
      colorByField: 'top10',
    });

    const frames = buildFrameViews(series as any, options);
    expect(frames).toHaveLength(0);
  });

  test('buildFrameViews prefers exact name match when present', () => {
    const series = [
      {
        name: 'A',
        refId: 'A',
        fields: [
          makeField({ name: 'project_key', type: FieldType.string, config: { displayName: 'Project Key' } }),
          makeField({ name: 'debt_days', type: FieldType.number, config: { displayName: 'Debt Days' } }),
          makeField({ name: 'top10', type: FieldType.number, config: { displayName: 'Top 10%' } }),
        ],
      },
    ];

    const options = makeOptions({
      textField: 'project_key',
      sizeField: 'debt_days',
      colorByField: 'top10',
    });

    const frames = buildFrameViews(series as any, options);
    expect(frames).toHaveLength(1);
    expect(frames[0].size?.name).toBe('debt_days');
    expect(frames[0].color?.name).toBe('top10');
  });
});
