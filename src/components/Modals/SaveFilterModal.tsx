import React from "react";
import {
  Dialog,
  Box,
  Card,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  InputBase,
  Button,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SaveFilterModalProps {
  mode: 'light' | 'dark';
  open: boolean;
  saveFilterName: string;
  saveDescription: string;
  saveTags: string;
  validationError: { filter: string[] };
  onClose: () => void;
  onSave: () => void;
  onFilterNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}

const SaveFilterModal: React.FC<SaveFilterModalProps> = ({
  mode,
  open,
  saveFilterName,
  saveDescription,
  saveTags,
  validationError,
  onClose,
  onSave,
  onFilterNameChange,
  onDescriptionChange,
  onTagsChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ bgcolor: '#0057D9', width: '100%', height: 35, display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ color: "white", ml: 2, mt: 0.5 }}>Save Filter</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <Card sx={{ width: 400, p: 2, mx: "auto", outline: "none" }}>
        {validationError.filter.length > 0 && (
          <Alert variant='outlined' severity="warning" sx={{ mb: 1 }}>
            {validationError.filter[0]}
          </Alert>
        )}

        <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1 }}>
          <InputLabel sx={{ display: 'flex' }}>
            Filter Name<Typography color="red">*</Typography>
          </InputLabel>
          <InputBase
            value={saveFilterName}
            onChange={(e) => onFilterNameChange(e.target.value)}
            sx={{ width: "100%", pt: 0.5 }}
            required
            fullWidth
          />
        </FormControl>

        <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1, mt: 2 }}>
          <InputLabel sx={{ display: 'flex' }}>
            Description<Typography color="red">*</Typography>
          </InputLabel>
          <InputBase
            value={saveDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            sx={{ fontSize: "14px", width: "100%", pt: 0.5, mt: 2 }}
            required
            fullWidth
            multiline
            minRows={5}
          />
        </FormControl>

        <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1, mt: 2 }}>
          <InputLabel sx={{ display: 'flex' }}>
            Tags (comma separated)
          </InputLabel>
          <InputBase
            value={saveTags}
            onChange={(e) => onTagsChange(e.target.value)}
            sx={{ width: "100%", pt: 0.5 }}
            fullWidth
          />
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
            sx={{ width: "48%" }}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            variant="contained"
            color="primary"
            sx={{ width: "48%", bgcolor: '#0057D9' }}
            disabled={!saveFilterName || !saveDescription}
          >
            Save
          </Button>
        </Box>
      </Card>
    </Dialog>
  );
};

export default SaveFilterModal;