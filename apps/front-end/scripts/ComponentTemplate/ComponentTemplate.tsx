import type { JSX } from "react";

export interface ComponentTemplateProps {
  prop: any;
}

export const ComponentTemplate = ({ prop }: ComponentTemplateProps): JSX.Element => {
  return <div data-testid="ComponentTemplate">{prop}</div>;
};
