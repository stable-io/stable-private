export interface ComponentTemplateProps {
  prop: any;
}

export const ComponentTemplate = ({ prop }: ComponentTemplateProps) => {
  return <div data-testid="ComponentTemplate">{prop}</div>;
};
