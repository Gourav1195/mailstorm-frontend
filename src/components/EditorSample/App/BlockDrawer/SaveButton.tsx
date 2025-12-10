import React, {useState} from "react";
import {Button, Dialog, } from '@mui/material'
import { Template } from 'types/template';
import { useAppDispatch } from "../../../../redux/hooks";
import { createTemplateThunk, updateTemplate } from "../../../../redux/slices/templateSlice";
import AllModal from "../../../../components/Modals/DeleteModal";
import { useNavigate } from "react-router-dom";
import TestEmailPopUp from "./TestEmailPopUp";
import ClipLoader from "react-spinners/ClipLoader";
import Loader from "../../../../components/Modals/Loader";

interface TemplateEditorProps {
  TemplateDetails : Template;
  setTemplateDetails: React.Dispatch<React.SetStateAction<Template>>;
  isEdit: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SaveButton ({TemplateDetails, setTemplateDetails, isEdit, setError, setIsEditMode}: TemplateEditorProps){
  const [openTest, setOpenTest] = useState(false);  
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('isRedirect');
  const isRedirect = redirect === 'true';
  console.log('isRedirect', isRedirect);

  const saveTemplate = async () => {
    setTimeout(()=>{
      setError(null);
    }, 7000)
    if (!TemplateDetails.name || !/^[a-zA-Z0-9\s]{3,50}$/.test(TemplateDetails.name)) {
      setError("Template name should be 3-50 characters and contain only letters, numbers, and spaces.");
      return;
    }  
    if (!TemplateDetails.category) {
      setError("Category is Required");
      return;
    }  
    if (!TemplateDetails?.content?.root?.data?.childrenIds || TemplateDetails.content?.root?.data.childrenIds.length === 0) {
      setError("Template Design is Required");
      return;
    }  
    if (/^copy/i.test(TemplateDetails?.name.trim())) {
      setError("Name Cannot Start from 'Copy'");
      return;
    } 
    setIsLoading(true);
    try {
      if(isEdit){
        await dispatch(updateTemplate({ id: TemplateDetails._id, data: TemplateDetails }) as any);
      }
      else{
        await dispatch(createTemplateThunk(TemplateDetails));
      }
      setOpen(true);
      setIsEditMode(false);
      console.log('form Submitted', TemplateDetails);
    } catch (err) {
      console.error('Save failed:', err);
    }       
    setIsLoading(false);
  };

  const handleConfirm = () =>{
    if(isRedirect){
      navigate('/create-campaign', { state: { step: 2 } });
    }
    else{
      navigate('/templates')
    }
  }

  const handleOpenSaveModal = () => {
    setTimeout(()=>{
      setError(null);
    }, 7000)
    if (!TemplateDetails.name || !/^[a-zA-Z0-9\s]{3,50}$/.test(TemplateDetails.name)) {
      setError("Template name should be 3-50 characters and contain only letters, numbers, and spaces.");
      return;
    }  
    if (!TemplateDetails.category) {
      setError("Category is Required");
      return;
    }  
    if (!TemplateDetails?.content?.root?.data?.childrenIds || TemplateDetails.content?.root?.data.childrenIds.length === 0) {
      setError("Template Design is Required");
      return;
    }  
    if (/^copy/i.test(TemplateDetails?.name.trim())) {
      setError("Name Cannot Start from 'Copy'");
      return;
    } 
    setOpenTest(true);
  }

    return(
      <>
        <Button variant="contained" color='primary'
        onClick={handleOpenSaveModal}
        sx={{bgcolor:'#0057D9', borderRadius:'6px', minWidth:'80px', height:'54px', }}
        > {isEdit ? 'Update' : 'Save'}</Button>

        <AllModal
          open={open}
          handleClose={() => {setOpen(false)}}
          handleConfirm={handleConfirm}          
          title="Success"
          message={`${TemplateDetails.name}Template is Saved Successfully`}
          btntxt="Yes"
          icon={{ type: "success" }}
          color="primary"
        />

        <TestEmailPopUp
          open={openTest}
          handleClose={() => {setOpenTest(false)}}
          handleConfirm={saveTemplate}  
          testEmails={TemplateDetails.testEmails}
          personalNote ={TemplateDetails.personalNote}
          setTemplateDetails={setTemplateDetails}  
          />
        
        <Loader 
          isLoading={isLoading}
        />
        
      </>
    )
}