import React, { useEffect, useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import TvIcon from '@mui/icons-material/Tv';
import DescriptionIcon from "@mui/icons-material/Description";
import RateReviewIcon from "@mui/icons-material/RateReview";
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Types } from 'mongoose';
import { useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid2 as Grid,
  Card,
  CardContent,
  Stepper, StepConnector, stepConnectorClasses,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Step2Templates from './Step2Templates';
import Step3Schedule from './Step3Schedule';
import Step4Review from './Step4Review';
import Step0CampaignType from './Step0CampaignType';
import { CampaignData, Schedule } from '../../types/campaign';
import { createCampaign, fetchCampaignById } from '../../redux/slices/campaignSlice';
import Step1Audience from './Step1Audience';
import SuccessModal from '../Modals/SuccessModal';
import { useNavigate } from 'react-router-dom';
// import useUnsavedChangesWarning from '../../hooks/usePrompt';
import { useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import { updateCampaign, setSelectedCampaignData } from "../../redux/slices/campaignSlice";
import DeleteModal from '../Modals/AllModal';
import { DynamicIconProps } from '../../types/modal';
import CryptoJS from 'crypto-js';
import { useDesignSystem } from '../../design/theme';
const SpacedBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#0057D9',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#0057D9',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#B8B8B8',
    borderTopWidth: 2,
    borderRadius: 1,
  },
}));

// const stepIcons = [
//   '/icons/presention-chart.png',
//   '/icons/people.png',
//   '/icons/description.png',
//   '/icons/calendar-today.png',
//   '/icons/rate-review.png',
// ];
export default function CampaignCreator() {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [backupSchedule, setBackupSchedule] = useState<Schedule>({} as Schedule);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [audienceName, setAudienceName] = useState<string>('');
  const [templateData, setTemplateData] = useState<{ name: string; type: string }>({
    name: '',
    type: 'Email',
  });
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: '',
    type: "",
    audience: null as Types.ObjectId | null,
    template: null as Types.ObjectId | null,
    schedule: null,
    openRate: 0,
    ctr: 0,
    delivered: 0,
  });
  const [isDeleteModalopen, setIsDeleteModalopen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // useUnsavedChangesWarning(!isFormSaved);
  const handleExit = () => {
    // const leave = window.confirm('You have unsaved changes. Do you really want to leave?');
    // if (!leave) return;
    navigate('/');
    resetState();
    dispatch(setSelectedCampaignData({
      _id: null,
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
  };
  const mode = useSelector((state: RootState) => state.theme.mode);
  const ds = useDesignSystem(mode);
  useEffect(() => {
    if (location.state?.step !== undefined) {
      setActiveStep(location.state.step);
    }
  }, [location.state]);

  let steps = [], stepIcons: React.ElementType[] = [];
  if (campaignData.type === "Real Time") {
    steps = ['Campaign Type', 'Audience', 'Template', 'Review & Launch'];
    stepIcons = [TvIcon, PeopleIcon, DescriptionIcon, RateReviewIcon];
  }
  else {
    steps = ['Campaign Type', 'Audience', 'Template', 'Schedule', 'Review & Launch'];
    stepIcons = [TvIcon, PeopleIcon, DescriptionIcon, CalendarTodayIcon, RateReviewIcon];
  }

  const { id: encryptedId } = useParams();
  const [id, setId] = useState<string | null>(null);
  const secretKey = (process.env.REACT_APP_ENCRYPT_SECRET_KEY as string);

  useEffect(() => {
    if (encryptedId) {
      try {
        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), secretKey);
        const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
        setId(decryptedId);
        console.log("Decrypted ID:", decryptedId);
      } catch (error) {
        console.error("Failed to decrypt ID:", error);
        setId(null);
      }
    }
  }, [encryptedId, secretKey]);

  const campaignFromStore = useSelector((state: RootState) => state.campaign.selectedCampaign);

  useEffect(() => {
    if (id) {
      dispatch(fetchCampaignById(id));
      setIsEditMode(true);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (campaignFromStore) {
      setCampaignData({
        ...campaignFromStore,
        schedule: campaignFromStore.schedule ? { ...campaignFromStore.schedule } : null,
      });
    }
  }, [campaignFromStore]);

  const resetState = () => {
    setCampaignData({
      _id: null,
      name: '',
      type: "",
      audience: null,
      template: null,
      schedule: null,
      // {      
      //   frequency: '',
      //   time: '09:00',
      //   startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      //   endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      // },
      status: "Draft",
      openRate: 0,
      ctr: 0,
      delivered: 0,
    });
  };

  // useEffect(() => {
  //   if (!id) resetState();
  // }, [id]);

  useEffect(() => {
    if (campaignData.type === "Real Time") {
      if (campaignData.schedule !== null && campaignData.schedule) {
        setBackupSchedule(campaignData.schedule);
      }
      setCampaignData(prevData => ({
        ...prevData,
        schedule: null,
      }));
    } else {
      // Restore schedule when type changes back
      if (campaignData.schedule === null && backupSchedule) {
        setCampaignData(prevData => ({
          ...prevData,
          schedule: backupSchedule,
        }));
      }
    }
    // console.log("Schedule: ", campaignData.schedule);
  }, [campaignData.type, campaignData.schedule, backupSchedule]);
  // console.log("campaignData", campaignData);

  const handleNextStep = async () => {
    let errors: string[] = [];

    switch (activeStep) {
      case 0:
        if (!campaignData.name || !/^[a-zA-Z0-9\s]{3,50}$/.test(campaignData.name)) {
          errors.push("Campaign name should be 3-50 characters and contain only letters, numbers, and spaces. ");
        }
        if (!campaignData.name || /^copy/i.test(campaignData.name.trim())) {
          errors.push("Campaign name should not start with 'Copy' ");
        }
        if (!campaignData.type) {
          errors.push("Please select a campaign type.");
        }
        break;

      case 1:
        if (!campaignData.audience) {
          errors.push("Please select an audience.");
        }
        break;

      case 2:
        if (!campaignData.template) {
          errors.push("Please select a template.");
        }
        break;

      case 3:
        if (campaignData.type !== "Real Time") {
          if (campaignData.type === "Criteria Based" && !campaignData.schedule?.frequency) {
            errors.push("Schedule frequency is required.");
          }
          if (campaignData.type === "Criteria Based" && !campaignData.schedule?.endDate) {
            errors.push("Valid End Date is required.");
          }
          if (!campaignData.schedule?.time) {
            errors.push("Time is required.");
          }

          if (!campaignData.schedule?.startDate) {
            errors.push("Start date is required.");
          } else {
            const startDate = new Date(campaignData.schedule?.startDate);
            const today = new Date();
            startDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (startDate < today) {
              errors.push("Start date must be today or a future date.");
            } else if (startDate.getTime() === today.getTime() && campaignData.schedule?.time) {

              const [hours, minutes] = campaignData.schedule.time.split(":").map(Number);
              const selectedTime = new Date();
              selectedTime.setHours(hours, minutes, 0, 0);

              if (selectedTime < new Date()) {
                errors.push("Time must be in the future.");
              }
            }
          }

          if (campaignData.schedule?.startDate && campaignData.schedule?.endDate && new Date(campaignData.schedule?.startDate) > new Date(campaignData.schedule?.endDate)) {
            errors.push("End date must be after start date.");
          }
          // if ( campaignData.schedule?.startDate && new Date(campaignData.schedule?.startDate) < new Date()) {
          //   errors.push("The start date cannot be earlier than today");
          // }
        }
        break;

      default:
        break;
    }
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
 
    console.log("campaignData", campaignData);

    console.log('Moving to next step:', activeStep);
  try {
    let campaignId = campaignData._id;

// CREATE once
if (!campaignId) {
  const res = await dispatch(createCampaign(campaignData)).unwrap();
  campaignId = res.campaign._id;

  setCampaignData(prev => ({
    ...prev,
    _id: campaignId
  }));
} else {
  // UPDATE always after creation
  await dispatch(
    updateCampaign({
      campaignId,
      updatedData: campaignData
    })
  ).unwrap();
}

// Navigation vs scheduling
if (activeStep < steps.length - 1) {
  setActiveStep(prev => prev + 1);
} else {
  if (!campaignId) {
    setValidationErrors(["Campaign ID is missing. Cannot schedule campaign."]);
    return;
  }
  await dispatch(
    updateCampaign({
      campaignId,
      updatedData: { ...campaignData, action: "Scheduled" }
    })
  ).unwrap();

  setOpen(true);
  setIsEditMode(false);
}

  } catch (error) {
    console.error("Campaign step error:", error);
    setValidationErrors(["An error occurred while saving the campaign. Please try again."]);
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  useSelector((state: RootState) => state.campaign.selectedCampaign);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const scheduleKeys = ["frequency", "time", "startDate", "endDate"];

    setCampaignData(prev => {
      // If this field belongs in schedule, build updatedSchedule; else leave it alone
      const updatedSchedule = scheduleKeys.includes(name)
        ? {
          ...(prev.schedule || {}),
          [name]:
            name === "startDate" || name === "endDate"
              ? new Date(value)
              : value,
        }
        : prev.schedule;

      // Only put [name] at top level if it’s not a schedule key
      return {
        ...prev,
        ...(scheduleKeys.includes(name) ? {} : { [name]: value }),
        schedule: updatedSchedule,
      };
    });
  };

  const handleDateChange = (
    value: Dayjs | null,
    type: "startDate" | "endDate",
    context: { validationError: any }
  ) => {
    if (!value || !campaignData) return;

    const newDate = value.toDate();

    if (
      type === "endDate" &&
      campaignData?.schedule?.startDate &&
      value.isBefore(dayjs(campaignData.schedule.startDate))
    ) {
      // optionally handle error state
      return;
    }

    dispatch(
      setSelectedCampaignData({
        ...campaignData,
        schedule: {
          ...(campaignData.schedule || {}),
          [type]: newDate,
        },
      })
    );
  };

  // console.log('campaignData: ', campaignData);
  // console.log("isEditMode", isEditMode);
  const renderStepContent = (step: number) => {
    let adjustedStep = step;
    if (campaignData.type === "Real Time" && step >= 3) {
      adjustedStep = step + 1;
    }
    switch (adjustedStep) {
      case 0:
        return <Step0CampaignType mode={mode} handleChange={handleChange} campaignData={campaignData} />;
      case 1:
        return <Step1Audience mode={mode} handleChange={handleChange} campaignData={campaignData} audienceName={audienceName} setAudienceName={setAudienceName} />
      case 2:
        return <Step2Templates mode={mode} handleChange={handleChange} campaignData={campaignData} templateData={templateData} setTemplateData={setTemplateData} />;
      case 3:
        return <Step3Schedule mode={mode} handleChange={handleChange} campaignData={campaignData} handleDateChange={handleDateChange} setCampaignData={setCampaignData} />;
      case 4:
        return <Step4Review mode={mode} campaignData={campaignData} audienceName={audienceName} templateData={templateData} />;
      default:
        return <Typography variant="h6">Unknown Step</Typography>;
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', flexGrow: 10, py: 4, bgcolor: ds.colors.surface,color: ds.colors.textPrimary, maxWidth: { xs: '100%', }, }}>
      <Typography sx={{ fontSize: "26px", }} gutterBottom>
        Create a New Campaign
      </Typography>

      {validationErrors.length > 0 && (
        <Alert variant='outlined' severity="warning" sx={{ mb: 1 }}>
          {validationErrors[0]}
        </Alert>
      )}

      <DeleteModal
        open={isDeleteModalopen}
        handleClose={() => setIsDeleteModalopen(false)}
        handleConfirm={handleExit}
        title="Exit Campaign"
        message="You have unsaved changes. Do you really want to leave?"
        btntxt="Discard"
        icon={{ type: "cancel" } as DynamicIconProps}
        color="warning"
      />

      <Box >
        <Card sx={{bgcolor: ds.colors.surfaceElevated,color: ds.colors.textPrimary, }}>
          <CardContent>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<CustomConnector />}
              sx={{ mb: 4 }}
            >
              {steps.map((label, index) => {
                const IconComponent = stepIcons[index];
                return (
                  <Step key={label}>
                    <StepLabel
                      icon={
                        //code for exact figma image
                        //   <img
                        //   src={stepIcons[index]}
                        //   alt={label}
                        //   style={{
                        //     padding: 4,
                        //     borderRadius: '50%',
                        //     width: '24px',
                        //     height: '24px',
                        //     backgroundColor: activeStep >= index ? '#0057D9' : '#F5F5F5',
                        //   }}
                        // />
                        <IconComponent
                          sx={{
                            p: 1,
                            borderRadius: '50%',
                            color: activeStep >= index ? '#fff' : '#B8B8B8',
                            bgcolor: activeStep >= index ? '#0057D9' : '#F5F5F5',
                            '&.Mui-completed': { color: '#0057D9' },
                            width: { xs: '35px', },
                            height: { xs: '35px', },
                          }}
                        />
                      }
                      sx={{
                        color: ds.colors.textPrimary,
                        flexDirection: 'column',
                        fontSize: { xs: '12px', sm: '15px' },
                        alignItems: 'center',
                        '& .MuiStepLabel-label': {
                          mt: 1,
                          textAlign: 'center',
                          fontSize: 'inherit',
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <Box
              sx={{
                 color: ds.colors.textPrimary,
                minwidth: '100%',
                minHeight: { xs: '300px', md: '400px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              {renderStepContent(activeStep)}
            </Box>
            <SpacedBox sx={{ width: "100%", borderTop: '2px solid #E5E5E5', pt: 2 }}>
              <Grid container sx={{ justifyContent: "space-between" }}  >
                <Grid>
                  <Button
                    variant="outlined"
                    onClick={handlePreviousStep}
                    disabled={activeStep === 0}
                  >
                    Previous
                  </Button>
                </Grid>
                <Grid>
                  <Button onClick={() => setIsDeleteModalopen(true)} color="error" variant="contained" sx={{ mr: 1.5 }}>exit</Button>
                  <Button sx={{ bgcolor: ds.colors.primary }} variant="contained" onClick={handleNextStep}>
                    {(activeStep === steps.length - 1) ? 'Launch Campaign' : activeStep === 0 ? 'Next' : 'Save & Continue'}
                  </Button>
                  <SuccessModal open={open} onClose={() => setOpen(false)}
                    title={id ? "Campaign Updated Successfully" : "Campaign Created Successfully"}
                    message={`"${campaignData.name}" Campaign Saved Successfully`} />
                </Grid>
              </Grid>

            </SpacedBox>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
