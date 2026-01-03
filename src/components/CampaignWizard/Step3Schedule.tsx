import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid2 as Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
// import { PickerChangeHandlerContext } from '@mui/x-date-pickers/internals';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { CampaignData } from 'types/campaign';
import { useSelector } from 'react-redux';
import { RootState } from "../../redux/store";

interface ScheduleFormProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  campaignData: CampaignData;
  handleDateChange: (
    value: Dayjs | null,
    type: "startDate" | "endDate",
    context: { validationError: any }
  ) => void;
  mode: 'light' | 'dark';
  setCampaignData:React.Dispatch<React.SetStateAction<CampaignData>>;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ mode, handleChange, campaignData, handleDateChange, setCampaignData }) => {
  const selectedCampaign = useSelector((state: RootState) => state.campaign.selectedCampaign);

  useEffect(() => {
  if (selectedCampaign && selectedCampaign.schedule) {
    const { frequency, time, startDate, endDate, ...rest } = selectedCampaign.schedule;

    setCampaignData(prevData => ({
      ...prevData,
      ...rest, // spread other fields except schedule-related ones
      schedule: selectedCampaign.schedule
        ? { ...prevData.schedule, ...selectedCampaign.schedule }
        : prevData.schedule,
    }));
  }
}, [selectedCampaign]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ m: 2 }}>
        <Typography variant="h6" fontWeight={'500'} >Campaign Schedule</Typography>
        <Typography sx={{ color: "#626262", mb: 3, fontSize: '14px' }}>Set when your campaign should run</Typography>

        {campaignData.type === 'Scheduled' ?
          (<>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, md: 4 }}>

                <TextField
                  fullWidth
                  name="time"
                  label="Time*"
                  type="time"
                  value={campaignData.schedule?.time}
                  onChange={(e) => handleChange(e)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    step: 300,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <DatePicker
                  name="startDate"
                  label="Launch Date*"
                  value={campaignData.schedule?.startDate ? dayjs(campaignData.schedule?.startDate) : null}
                  onChange={(value, context) => handleDateChange(value, "startDate", context)} format="MM/DD/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  sx={{ minWidth: "145px" }}
                />
              </Grid>
            </Grid>
          </>
          ) :
          (<>
            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel component="legend" required sx={{ mb: 1, fontWeight: 'bold' }}>
                Select Frequency
              </FormLabel>
              <RadioGroup
                value={campaignData.schedule?.frequency || selectedCampaign?.schedule?.frequency}
                onChange={(e) => handleChange({ target: { name: "frequency", value: e.target.value } } as any)}>
                <FormControlLabel value="Daily" control={<Radio sx={{ color: '#A2A2A2' }} />} label="Daily" sx={{ border: 'solid 1px #ECEEF6', color: '#626262', mb: 1 }} />
                <FormControlLabel value="Weekly" control={<Radio sx={{ color: '#A2A2A2' }} />} label="Weekly" sx={{ border: 'solid 1px #ECEEF6', color: '#626262', mb: 1 }} />
                <FormControlLabel value="Monthly" control={<Radio sx={{ color: '#A2A2A2' }} />} label="Monthly" sx={{ border: 'solid 1px #ECEEF6', color: '#626262', mb: 1 }} />
              </RadioGroup>
            </FormControl>

            <Grid container spacing={3}>
              <Grid size={{ xs: 6, md: 4 }}>
                <TextField
                  fullWidth
                  name="time"
                  label="Time*"
                  type="time"
                  value={campaignData.schedule?.time}
                  onChange={(e) => handleChange(e)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    step: 300,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <DatePicker
                  name="startDate"
                  label="Start Date*"
                  value={campaignData.schedule?.startDate ? dayjs(campaignData.schedule?.startDate) : null}
                  onChange={(value, context) => handleDateChange(value, "startDate", context)} format="MM/DD/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  sx={{ minWidth: "145px" }}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <DatePicker
                  name="endDate"
                  label="End Date*"
                  value={campaignData.schedule?.endDate ? dayjs(campaignData.schedule?.endDate) : null}
                  onChange={(value, context) => handleDateChange(value, "endDate", context)} format="MM/DD/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                  sx={{ minWidth: "145px" }}
                />
              </Grid>
            </Grid>
          </>)}

      </Box>
    </LocalizationProvider>

  );
}

export default ScheduleForm;