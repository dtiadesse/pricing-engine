export interface TabularListItem {
  key: string;
  label: string;
  value: string | number;
  type: string;
  [key: string]: any;
}

export type RowHeightStyle = "normal" | "condensed" | "hightly-condenced";
