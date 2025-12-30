import React from "react";
import {
  Dialog,
  Box,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  InputBase,
  Select,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Criteria {
  key: string | null;
  label: string;
  dataType: string;
  operator: string;
  operators: string[];
}

interface AddCriteriaModalProps {
  open: boolean;
  newCriteria: Criteria;
  validationError: { criteria: string[] };
  createBlockError: string;
  operators: any;
  operatorLabels: { [key: string]: string };
  onClose: () => void;
  onSave: () => void;
  onCriteriaChange: (field: keyof Criteria, value: string) => void;
  mode: 'light' | 'dark';
}

const AddCriteriaModal: React.FC<AddCriteriaModalProps> = ({
  mode,
  open,
  newCriteria,
  validationError,
  createBlockError,
  operators,
  operatorLabels,
  onClose,
  onSave,
  onCriteriaChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ width: '450px' }}>
        <Box sx={{ bgcolor: '#0057D9', width: '100%', height: 35, display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: "white", ml: 2, mt: 0.5 }}>Add New Criteria Block</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
        <DialogContent>
          {validationError.criteria.length > 0 && (
            <Alert variant='outlined' severity="warning" sx={{ mb: 1 }}>
              {validationError.criteria[0]}
            </Alert>
          )}

          <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1 }}>
            <InputLabel sx={{ display: 'flex' }}>
              Block Name<Typography color="red">*</Typography>
            </InputLabel>
            <InputBase
              value={newCriteria.label}
              onChange={(e) => onCriteriaChange("label", e.target.value)}
              required
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" size="medium" sx={{
            minWidth: 200, bgcolor: "#F8F9FA", borderRadius: "6px", mt: 2.5,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
          }}>
            <InputLabel sx={{ display: 'flex' }}>
              Data Type<Typography color="red">*</Typography>
            </InputLabel>
            <Select
              value={newCriteria.dataType || ''}
              label="Data Type"
              onChange={(e) => onCriteriaChange("dataType", e.target.value)}
              required
              sx={{ color: "#6D6976" }}
            >
              {['string', 'date', 'number'].map((c) => (
                <MenuItem key={c} value={c} sx={{ color: "#6D6976" }}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" size="medium" sx={{
            minWidth: 200, bgcolor: "#F8F9FA", borderRadius: "6px", mt: 2.5,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
          }}>
            <InputLabel sx={{ display: 'flex' }}>
              Operator<Typography color="red">*</Typography>
            </InputLabel>
            <Select
              value={newCriteria.operator || ""}
              label="Operator"
              onChange={(e) => onCriteriaChange("operator", e.target.value)}
              required
              sx={{ color: "#6D6976" }}
            >
              {newCriteria.dataType &&
                operators[newCriteria.dataType]?.map((operator: string) => (
                  <MenuItem key={operator} value={operator} sx={{ color: "#6D6976" }}>
                    {operatorLabels[operator] || operator}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {createBlockError && (
            <Typography color="error" variant="caption">
              {createBlockError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={onSave}
            variant="contained"
            color="primary"
            sx={{ bgcolor: '#0057D9' }}
            disabled={!newCriteria.label || !newCriteria.dataType || !newCriteria.operator}
          >
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddCriteriaModal;