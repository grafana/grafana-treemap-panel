// Derived from https://github.com/marcusolsson/grafana-plugin-support

import React from "react";
import { Alert, Badge, Icon, useTheme2 } from "@grafana/ui";
import { Field, FieldType } from "@grafana/data";
import { css } from "@emotion/css";

interface Props {
  schema: FieldSchema[];
  fields?: Field[];
  url: string;
}

export const PanelWizard = ({ schema, fields, url }: Props) => {
  const theme = useTheme2();

  const report = validateFields(fields ?? [], schema);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Alert
        title="Configure your query"
        severity="info"
        style={{ maxWidth: "500px" }}
      >
        <p>{`Define a data source query that return at least the following field${
          report.length > 1 ? "s" : ""
        }:`}</p>
        <div>
          {report.map(({ type, description, ok }, key) => (
            <div
              key={key}
              className={css`
                display: flex;
                align-items: center;
                padding-bottom: ${theme.spacing(1)};
                & > * {
                  margin-right: ${theme.spacing(1)};
                }
                & > *:last-child {
                  margin-right: 0;
                }
              `}
            >
              {ok ? (
                <Icon
                  name={"check-circle"}
                  size={"lg"}
                  style={{
                    color: theme.colors.success.main,
                  }}
                />
              ) : (
                <Icon
                  name="circle"
                  size={"lg"}
                  style={{
                    color: theme.colors.text.disabled,
                  }}
                />
              )}
              <Badge
                className={css`
                  margin-top: 0;
                `}
                text={type.slice(0, 1).toUpperCase() + type.slice(1)}
                color={"blue"}
              />
              {description && <span>{`${description}`}</span>}
            </div>
          ))}
        </div>
        {url && <div>
          <a href={url}>Read more</a>
          </div>
        }
      </Alert>
    </div>
  );
};

export type FieldSchema = { type: FieldType; description?: string };

export const validateFields = (
  fields: Field[],
  schema: FieldSchema[]
): Array<FieldSchema & { ok: boolean }> => {
  const seen: Field[] = [];
  return schema.map(({ type, description }) => {
    const field = fields
      .filter((field) => !seen.includes(field))
      .find((field) => field.type === type);
    if (field) {
      seen.push(field);
    }
    return { type, description, ok: !!field };
  });
};
