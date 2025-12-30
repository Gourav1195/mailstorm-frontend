import React from "react";
import { useDrop } from "react-dnd";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemType = "CRITERIA";

interface AppliedCriteria {
  key: string;
  label: string;
  dataType: string;
  operator: string;
  value: string;
  availableOperators: string[];
}

interface DropGroupProps {
  groupId: number;
  items: AppliedCriteria[];
  onDrop: (criteria: any, groupId: number) => void;
  onRemove: (criteriaLabel: string, groupId: number) => void;
  onUpdate: (
    criteriaLabel: string,
    groupId: number,
    field: keyof AppliedCriteria,
    value: string
  ) => void;
}

const operatorLabels: { [key: string]: string } = {
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

const DropGroup: React.FC<DropGroupProps> = ({
  groupId,
  items,
  onDrop,
  onRemove,
  onUpdate,
}) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item: { criteria: any }) => {
      onDrop(item.criteria, groupId);
    },
  });
  
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Box
      ref={drop as any}
      sx={{
        p: 0,
        minHeight: 100,
        mt: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: safeItems.length === 0 ? "center" : "flex-start",
        alignItems: safeItems.length === 0 ? "center" : "flex-start",
        textAlign: "center",
      }}
    >
      {safeItems.length === 0 ? (
        <Box>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Drag and drop fields
          </Typography>
          <Typography variant="body2" sx={{ color: "#A3AABC" }}>
            Drag fields here to create custom filters
          </Typography>
        </Box>
      ) : (
        safeItems.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              border: "1px solid #ccc",
              mt: 1,
              bgcolor: '#ffffff',
              color: '#6D6976',
            }}
          >
            <Typography>{item.label}</Typography>
            <Select
              value={item.operator || ""}
              onChange={(e) => onUpdate(item.label, groupId, "operator", e.target.value)}
              size="small"
              displayEmpty
              renderValue={(selected) =>
                selected ? operatorLabels[selected] || selected : <em>Select</em>
              }
              sx={{ color: '#6D6976' }}
            >
              {item.availableOperators.map((op: string) => (
                <MenuItem key={op} value={op} sx={{ color: '#6D6976' }}>
                  {operatorLabels[op] || op}
                </MenuItem>
              ))}
            </Select>

            {item.dataType === "string" ? (
              <TextField
                size="small"
                value={item.value}
                onChange={(e) =>
                  onUpdate(item.label, groupId, "value", e.target.value)
                }
                sx={{
                  "& .MuiInputBase-input": {
                    color: "#6D6976",
                  },
                }}
              />
            ) : item.dataType === "date" ? (
              <TextField
                type="date"
                size="small"
                value={item.value}
                onChange={(e) =>
                  onUpdate(item.label, groupId, "value", e.target.value)
                }
                sx={{
                  "& .MuiInputBase-input": {
                    color: "#6D6976",
                  },
                }}
              />
            ) : (
              <TextField
                type="number"
                size="small"
                value={item.value}
                onChange={(e) =>
                  onUpdate(item.label, groupId, "value", e.target.value)
                }
                sx={{
                  "& .MuiInputBase-input": {
                    color: "#6D6976",
                  },
                }}
              />
            )}
            <IconButton
              size="small"
              onClick={() => onRemove(item.label, groupId)}
            >
              <DeleteIcon fontSize="small" sx={{ "&:hover": { color: 'red' } }} />
            </IconButton>
          </Box>
        ))
      )}
    </Box>
  );
};

export default DropGroup;