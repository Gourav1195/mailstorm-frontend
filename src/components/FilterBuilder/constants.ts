export const operators: any = {
  string: [
    'equals',
    'not equals',
    'contains',
    'notContains',
    'startsWith',
    'endsWith',
    'isEmpty',
    'isNotEmpty'
  ],
  number: [
    'equals',
    'not equals',
    'greaterThan',
    'greaterThanOrEqual',
    'lessThan',
    'lessThanOrEqual',
    'between',
    'in',
    'notIn',
    'isEmpty',
    'isNotEmpty'
  ],
  date: [
    'equals',
    'not equals',
    'before',
    'after',
    'on',
    'not on',
    'between',
    'onOrBefore',
    'onOrAfter',
    'notBetween',
    'isEmpty',
    'isNotEmpty'
  ],
};

export const operatorLabels: { [key: string]: string } = {
  "equals": "equals (=)",
  "not equals": "not equals (!=)",
  "contains": "contains (∋)",
  "notContains": "not contains (∌)",
  "startsWith": "starts with (^) ",
  "endsWith": "ends with ($)",
  "isEmpty": "is empty (∅)",
  "isNotEmpty": "is not empty (≠∅)",
  "greaterThan": "greater than (>)",
  "greaterThanOrEqual": "greater than or equal (≥)",
  "lessThan": "less than (<)",
  "lessThanOrEqual": "less than or equal (≤)",
  "between": "between (↔)",
  "in": "in (∈)",
  "notIn": "not in (∉)",
  "before": "before (<)",
  "after": "after (>)",
  "on": "on (=)",
  "not on": "not on (!=)",
  "onOrBefore": "on or before (≤)",
  "onOrAfter": "on or after (≥)",
  "notBetween": "not between (≠↔)",
};

export const initialCriteriaTabs: Record<string, any[]> = {
  Tab1: [],
  Tab2: [],
};