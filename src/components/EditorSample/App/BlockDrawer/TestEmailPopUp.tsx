import { Box, Button, Dialog, DialogActions, FormControl, InputLabel, IconButton, InputBase, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from "react";
import { Template } from "types/template";
// TestEmailPopUp
type TestEmailPopUpProp = {
  open: boolean;
  testEmails?: string;
  personalNote?: string;
  handleConfirm: ()=> void;
  handleClose: ()=> void;
  setTemplateDetails: React.Dispatch<React.SetStateAction<Template>>;  
}

export default function TestEmailPopUp({open, testEmails, personalNote, handleClose, handleConfirm, setTemplateDetails}: TestEmailPopUpProp) {
  
  return(
    <Dialog
    open={open}
    onClose={handleClose}
    fullWidth
    sx={{
      '& .MuiDialog-paper': {
        width: '80vw',
        maxWidth: '400px',
        maxHeight: '400px',
        borderRadius: '10px',
      },
    }}
  >
    <Box
      sx={{
        bgcolor: '#0057D9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Typography sx={{ color: 'white' }}> Save & Send a Test Mail</Typography>
      <IconButton onClick={handleClose}>
        <CloseIcon sx={{ color: 'white' }} />
      </IconButton>
    </Box>

    <Box sx={{ minHeight: '150px', p: 2 }}>
      <FormControl variant="outlined" size="small" sx={{ minWidth: {xs: '100%'}, bgcolor: "#F8F9FA", borderRadius: "6px", marginRight:"auto", mt:2 }}>
        <InputLabel htmlFor="status-select" sx={{ fontSize: "16px", boxSizing:"border-box", display: "flex", alignItems: "center", }}>
        Test Emails 
        </InputLabel>        
        <InputBase
        value={testEmails}
        onChange={(e) => setTemplateDetails((prev) => ({ ...prev, 'testEmails': e.target.value }))}
        name="Test Email"
        sx={{
          fontSize: "14px",
          width: "100%",
          p:1,       
        }}
      />     
      </FormControl>
      <Typography sx={{fontSize:'10px', color:'#A2A2A2', ml:1}}> Enter few email addresses separated by a comma. </Typography> 

      <FormControl variant="outlined" size="small" sx={{ minWidth: {xs: '100%'}, bgcolor: "#F8F9FA", borderRadius: "6px", marginRight:"auto", mt:4 }}>
        <InputLabel htmlFor="status-select" sx={{ fontSize: "16px", boxSizing:"border-box", display: "flex", alignItems: "center", }}>
        Personal Note
        </InputLabel>        
        <InputBase
        value={personalNote}
        onChange={(e) => setTemplateDetails((prev) => ({ ...prev, 'personalNote': e.target.value }))}
        name="Personal Note"
        sx={{
          fontSize: "14px",
          width: "100%",
          p:1       
        }}
      />      
      </FormControl>
    </Box>
    <DialogActions>
      <Button variant="outlined" onClick={handleClose} sx={{color:'#6D6976', bgcolor: '#EBEBEB', border:'none'}}>Cancel</Button>
      <Button
        onClick={handleConfirm}
        variant="contained"
        color="primary"
        sx={{ bgcolor: '#0057D9' }}
      >
        Save & Send
      </Button>
    </DialogActions>
  </Dialog>
 )
}