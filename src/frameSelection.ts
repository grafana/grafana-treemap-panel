import { Field, FieldType } from '@grafana/data';

import { FrameView, TreemapOptions } from './types';

export const normalize = (value?: string) => (value ?? '').trim();

export const fieldMatches = (field: Field, wanted?: string): boolean => {
  const wantedNormalized = normalize(wanted);
  if (!wantedNormalized) {
    return false;
  }

  const candidates = [
    field.name,
    field.config?.displayName,
    field.config?.displayNameFromDS,
    (field.state as any)?.displayName,
  ]
    .map(normalize)
    .filter(Boolean);

  return candidates.includes(wantedNormalized);
};

export const findFieldByTypeAndName = <T = unknown>(
  frame: { fields: Array<Field> },
  type: FieldType,
  wanted?: string
): Field<T> | undefined => {
  if (normalize(wanted)) {
    return frame.fields.find((f) => f.type === type && fieldMatches(f, wanted)) as Field<T> | undefined;
  }

  return frame.fields.find((f) => f.type === type) as Field<T> | undefined;
};

export const buildFrameViews = (
  series: Array<{ name?: string; refId?: string; fields: Array<Field> }>,
  options: TreemapOptions
): FrameView[] => {
  return series
    .map((frame) => {
      const text = findFieldByTypeAndName<string>(frame, FieldType.string, options.textField);
      const size = findFieldByTypeAndName<number>(frame, FieldType.number, options.sizeField);

      // Color is optional unless explicitly configured.
      const colorByFieldExplicit = normalize(options.colorByField).length > 0;
      const color = colorByFieldExplicit
        ? findFieldByTypeAndName<number>(frame, FieldType.number, options.colorByField)
        : size ?? findFieldByTypeAndName<number>(frame, FieldType.number);

      const groupBy = frame.fields.find((f) => fieldMatches(f, options.groupByField));

      const labels =
        options.labelFields
          ?.map((name) => frame.fields.find((f) => fieldMatches(f, name)))
          .filter((f): f is Field => Boolean(f)) ?? [];

      return {
        name: frame.name,
        refId: frame.refId,
        text,
        size,
        color,
        groupBy,
        labels,
      } as FrameView;
    })
    .filter((frame) => frame.text && frame.size && frame.color);
};
