import React from "react";
import { Box, Card, Typography } from "@mui/material";

interface FilterSummaryProps {
  estimatedAudience: number;
  mode: 'light' | 'dark';
}

const FilterSummary: React.FC<FilterSummaryProps> = ({ estimatedAudience, mode }) => {
  return (
    <Card sx={{ p: 2, width: 300 }}>
      <Typography variant="h6">
        Filter Summary
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: "#A3AABC" }}>
        Preview your audience
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 0, color: "#6D6976", fontWeight: 600 }}
      >
        Estimated Audience
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            marginRight: "4px",
            marginBottom: "-4px",
          }}
        >
          {estimatedAudience}
        </Typography>
        <Typography sx={{ color: "#A3AABC" }}>people</Typography>
      </Box>
    </Card>
  );
};

export default FilterSummary;