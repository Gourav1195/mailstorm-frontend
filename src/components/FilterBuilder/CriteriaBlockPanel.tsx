import React from "react";
import {
  Box,
  Card,
  Tabs,
  Tab,
  Typography,
  TextField,
  InputLabel,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DraggableItem from "./DraggableItem";

interface CriteriaBlockUI {
  key: string;
  label: string;
  dataType: string;
  operators: string[];
}

interface CriteriaBlockPanelProps {
  activeTab: string;
  criteriaTabs: Record<string, CriteriaBlockUI[]>;
  searchTerm: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  onSearchChange: (value: string) => void;
  onAddCustomField: (tab: string) => void;
  mode: 'light' | 'dark';
}

const CriteriaBlockPanel: React.FC<CriteriaBlockPanelProps> = ({
  mode,
  activeTab,
  criteriaTabs,
  searchTerm,
  onTabChange,
  onSearchChange,
  onAddCustomField,
}) => {
  return (
    <Card sx={{ p: 2, width: 335 }}>
      <Tabs value={activeTab} onChange={onTabChange}>
        {Object.keys(criteriaTabs).map((tab, index) => (
          <Tab
            key={tab}
            label={index === 0 ? "Filter Components" : "Trigger Filters"}
            value={tab}
          />
        ))}
      </Tabs>
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#F8F9FA",
            borderRadius: "8px",
            padding: "4px 8px",
          }}
        >
          <InputLabel>
            <SearchIcon fontSize="small" sx={{ mt: 0.6, color: '#A2A2A2' }} />
          </InputLabel>
          <TextField
            placeholder="Search Fields"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              style: { color: "#A2A2A2" },
            }}
            value={searchTerm}
            onChange={(e) => { onSearchChange(e.target.value) }}
            fullWidth
            sx={{
              backgroundColor: "#F8F9FA",
              borderRadius: "8px",
              paddingLeft: "8px",
            }}
          />
        </Box>
        <Typography
          sx={{ mb: 2, color: "#232232", fontWeight: "bold" }}
        >
          Criteria Blocks
        </Typography>
        <Box sx={{ maxHeight: '42vh', overflowY: 'auto', m: 2 }}>
          {criteriaTabs[activeTab]
            .filter((criteria: any) =>
              typeof criteria.label === "string" &&
              criteria.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((criteria: any) => (
              <DraggableItem key={criteria.label} criteria={criteria} />
            ))}
        </Box>

        <Button
          variant="text"
          color="primary"
          onClick={() => onAddCustomField(activeTab)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontWeight: 600,
            width: "100%",
            mt: 2,
            textTransform: "none",
          }}
        >
          <AddIcon fontSize="small" />
          Add Custom Field
        </Button>
      </Box>
    </Card>
  );
};

export default CriteriaBlockPanel;