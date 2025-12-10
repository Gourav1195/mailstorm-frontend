import
// React,
{ useEffect, useState } from 'react'
import ChooseTemplateModal from './ChooseTemplateModal'
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from 'react-router-dom';
import { setSelectedCampaignData } from '../../redux/slices/campaignSlice';
const CreateTemplate = () => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(true);
  const [selectedTemplateModal, setSelectedTemplateModal] = useState<"email" | "sms">("email");

  const handleSelect = (template: "email" | "sms") => {
    setSelectedTemplateModal(template);
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setSelectedCampaignData({
      _id: '',
      name: '',
      type: '',
      audience: null,
      template: null,
      schedule: null,
      status: 'Draft',
      openRate: 0,
      ctr: 0,
      delivered: 0,
    }));
  }, []);


  const handleConfirm = () => {
    console.log("Confirmed template:", selectedTemplateModal);
    if (selectedTemplateModal === "email") {
      navigate('/email-templates');
    }
    else if (selectedTemplateModal === "sms") {
      navigate('/build-sms');
    }
    else {
      console.log('Type Not Found');
    }
    setIsTemplateModalOpen(false);
  };

  return <ChooseTemplateModal open={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)}
    selectedTemplate={selectedTemplateModal}
    onSelect={handleSelect}
    onConfirm={handleConfirm}
  />
}

export default CreateTemplate;