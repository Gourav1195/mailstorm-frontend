import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader';

type LoadingProp = {
    isLoading: boolean;
}

export default function Loader({ isLoading }: LoadingProp) {
  return (
    <Dialog
      open={isLoading}
      onClose={() => {}}
      PaperProps={{
        style: { backgroundColor: 'transparent', boxShadow: 'none' },
      }}
    >
      <DialogContent
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <ClipLoader loading={isLoading} size={50} color="#1976d2" />
      </DialogContent>
    </Dialog>
  );
}

