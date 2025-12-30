import React from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { CloseRounded, } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import DropGroup from "./DropGroup";

interface AppliedCriteria {
  key: string;
  label: string;
  dataType: string;
  operator: string;
  value: string;
  availableOperators: string[];
}

interface FilterCanvasProps {
  activeTab: string;
  groupsByTab: { [tab: string]: any[] };
  groupOperatorsByTab: { [tab: string]: { [groupId: number]: string } };
  logicalOperatorsByTab: { [tab: string]: { [index: number]: "AND" | "OR" } };
  onAddGroup: () => void;
  onDeleteGroup: (groupId: number) => void;
  onDrop: (criteria: any, groupId: number) => void;
  onRemoveItem: (criteriaLabel: string, groupId: number) => void;
  onUpdateItem: (
    criteriaLabel: string,
    groupId: number,
    field: keyof AppliedCriteria,
    value: string
  ) => void;
  onGroupOperatorChange: (groupId: number, value: string) => void;
  onLogicalOperatorChange: (index: number, value: "AND" | "OR") => void;
  mode: 'light' | 'dark';
}

const FilterCanvas: React.FC<FilterCanvasProps> = ({
  mode,
  activeTab,
  groupsByTab,
  groupOperatorsByTab,
  logicalOperatorsByTab,
  onAddGroup,
  onDeleteGroup,
  onDrop,
  onRemoveItem,
  onUpdateItem,
  onGroupOperatorChange,
  onLogicalOperatorChange,
}) => {
  const currentGroups = groupsByTab[activeTab] || [];

  return (
    <Box sx={{ width: "43%" }}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6">
          Filter Canvas
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, color: "#A3AABC" }}>
          Create your custom filter by combining multiple conditions.
        </Typography>

        {currentGroups.map((group, index) => (
          <React.Fragment key={group.id}>
            {index > 0 && (
              <Box
                sx={{
                  mt: 2,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2">Match groups with:</Typography>
                <Select
                  value={logicalOperatorsByTab[activeTab]?.[index] || "OR"}
                  onChange={(e) =>
                    onLogicalOperatorChange(index, e.target.value as "AND" | "OR")
                  }
                  size="small"
                >
                  <MenuItem value="AND">AND</MenuItem>
                  <MenuItem value="OR">OR</MenuItem>
                </Select>
              </Box>
            )}

            <Box
              sx={{
                mt: 2,
                p: 2,
                border: "0.5px dashed #A3AABC",
                borderRadius: "2px",
                borderWidth: "3px",
                bgcolor: '#F8F9FA'
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Group {index + 1}
                </Typography>
                <Button
                  variant="text"
                  color="inherit"
                  size="small"
                  onClick={() => onDeleteGroup(group.id)}
                  sx={{
                    color: "grey.600",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  Clear
                  <CloseRounded fontSize="small" />
                </Button>
              </Box>

              <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2">Within group:</Typography>
                <Select
                  value={groupOperatorsByTab[activeTab]?.[group.id] || "AND"}
                  onChange={(e) =>
                    onGroupOperatorChange(group.id, e.target.value)
                  }
                  size="small"
                  sx={{ minWidth: 80, bgcolor: "#ffffff", color: '#6D6976', borderRadius: "4px" }}
                >
                  <MenuItem value="AND">AND</MenuItem>
                  <MenuItem value="OR">OR</MenuItem>
                </Select>
              </Box>

              <DropGroup
                groupId={group.id}
                items={group.criteria}
                onDrop={onDrop}
                onRemove={onRemoveItem}
                onUpdate={onUpdateItem}
              />
            </Box>
          </React.Fragment>
        ))}

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            variant="text"
            color="primary"
            onClick={onAddGroup}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            <AddIcon fontSize="small" />
            Add Group
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default FilterCanvas;