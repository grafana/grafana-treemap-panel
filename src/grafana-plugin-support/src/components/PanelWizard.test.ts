// Derived from https://github.com/marcusolsson/grafana-plugin-support

import { Field, FieldType } from "@grafana/data";
import { validateFields } from "./PanelWizard";

describe("Validate fields", () => {
  test("", () => {
    const input: Field[] = [
      {
        name: "Time",
        type: FieldType.time,
        values: [],
        config: {},
      },
      {
        name: "Value",
        type: FieldType.number,
        values: [],
        config: {},
      },
    ];

    const schema = [{ type: FieldType.time }];
    const output = validateFields(input, schema);

    expect(output).toStrictEqual([
      { type: FieldType.time, ok: true, description: undefined },
    ]);
  });

  test("", () => {
    const input: Field[] = [
      {
        name: "Time",
        type: FieldType.time,
        values: [],
        config: {},
      },
      {
        name: "Value",
        type: FieldType.number,
        values: [],
        config: {},
      },
    ];

    const schema = [{ type: FieldType.time }, { type: FieldType.number }];
    const output = validateFields(input, schema);

    expect(output).toStrictEqual([
      { type: FieldType.time, ok: true, description: undefined },
      { type: FieldType.number, ok: true, description: undefined },
    ]);
  });

  test("", () => {
    const input: Field[] = [
      {
        name: "Time",
        type: FieldType.time,
        values: [],
        config: {},
      },
      {
        name: "Value",
        type: FieldType.string,
        values: [],
        config: {},
      },
    ];

    const schema = [{ type: FieldType.time }, { type: FieldType.number }];
    const output = validateFields(input, schema);

    expect(output).toStrictEqual([
      { type: FieldType.time, ok: true, description: undefined },
      { type: FieldType.number, ok: false, description: undefined },
    ]);
  });

  test("", () => {
    const input: Field[] = [
      {
        name: "Value",
        type: FieldType.string,
        values: [],
        config: {},
      },
      {
        name: "Start",
        type: FieldType.time,
        values: [],
        config: {},
      },
      {
        name: "End",
        type: FieldType.time,
        values: [],
        config: {},
      },
    ];

    const schema = [
      { type: FieldType.string },
      { type: FieldType.time },
      { type: FieldType.time },
    ];
    const output = validateFields(input, schema);

    expect(output).toStrictEqual([
      { type: FieldType.string, ok: true, description: undefined },
      { type: FieldType.time, ok: true, description: undefined },
      { type: FieldType.time, ok: true, description: undefined },
    ]);
  });

  test("", () => {
    const input: Field[] = [
      {
        name: "Value",
        type: FieldType.string,
        values: [],
        config: {},
      },
      {
        name: "Start",
        type: FieldType.time,
        values: [],
        config: {},
      },
    ];

    const schema = [
      { type: FieldType.string },
      { type: FieldType.time },
      { type: FieldType.time },
    ];
    const output = validateFields(input, schema);

    expect(output).toStrictEqual([
      { type: FieldType.string, ok: true, description: undefined },
      { type: FieldType.time, ok: true, description: undefined },
      { type: FieldType.time, ok: false, description: undefined },
    ]);
  });

  test("", () => {
    const schema = [
      { type: FieldType.time },
      { type: FieldType.number },
      { type: FieldType.string },
      { type: FieldType.boolean },
      { type: FieldType.time },
      { type: FieldType.number },
    ];

    const input: Field[] = [
      {
        name: "Value",
        type: FieldType.string,
        values: [],
        config: {},
      },
      {
        name: "Start",
        type: FieldType.time,
        values: [],
        config: {},
      },
      {
        name: "Value",
        type: FieldType.string,
        values: [],
        config: {},
      },
      {
        name: "Value",
        type: FieldType.number,
        values: [],
        config: {},
      },
      {
        name: "Start",
        type: FieldType.time,
        values: [],
        config: {},
      },
    ];

    const output = validateFields(input, schema);

    expect(output).toStrictEqual([
      { type: FieldType.time, ok: true, description: undefined },
      { type: FieldType.number, ok: true, description: undefined },
      { type: FieldType.string, ok: true, description: undefined },
      { type: FieldType.boolean, ok: false, description: undefined },
      { type: FieldType.time, ok: true, description: undefined },
      { type: FieldType.number, ok: false, description: undefined },
    ]);
  });
});
