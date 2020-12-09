import React from 'react';
import { StandardEditorProps, FieldType } from '@grafana/data';
import { MultiSelect, Select } from '@grafana/ui';

interface Settings {
  filterByType: FieldType;
  multi: boolean;
}

interface Props extends StandardEditorProps<string | string[], Settings> {}

export const FieldSelectEditor: React.FC<Props> = ({ item, value, onChange, context }) => {
  if (context.data && context.data.length > 0) {
    const options = context.data
      .flatMap(frame => frame.fields)
      .filter(field => (item.settings?.filterByType ? field.type === item.settings?.filterByType : true))
      .map(field => ({
        label: field.name,
        value: field.name,
      }));

    if (item.settings?.multi) {
      return (
        <MultiSelect<string>
          isLoading={false}
          value={value as string[]}
          onChange={e => onChange(e.map(_ => _.value!))}
          options={options}
        />
      );
    } else {
      return <Select<string> isLoading={false} value={value} onChange={e => onChange(e.value)} options={options} />;
    }
  }

  return <Select onChange={() => {}} disabled={true} />;
};
