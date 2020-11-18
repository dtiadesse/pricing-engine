export type ButtonType = "primary" | "secondary" | "tertiary" | "toggle";

export interface ToggleButton {
  id: string;
  name: string;
  value: string | number | boolean;
  text?: string;
  icon?: string;
  disabled?: boolean;
}
export interface ToggleButtonGroup {
  groupName: string;
  value?: string | number | boolean;
  buttons: ToggleButton[];
}
