import React from "react";
import { useDrag } from "react-dnd";
import { Box, Typography } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";

const ItemType = "CRITERIA";

interface CriteriaBlockUI {
  key: string;
  label: string;
  dataType: string;
  operators: string[];
}

interface DraggableItemProps {
  criteria: CriteriaBlockUI;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ criteria }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { criteria: { ...criteria } },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Box
      ref={drag as any}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        p: 1,
        border: "3px solid #ECEEF6",
        borderRadius: "10px",
        mb: 1,
        display: "flex",
        alignItems: "center",
        color: "#6D6976",
      }}
    >
      <DragIndicator />
      {criteria.label}
    </Box>
  );
};

export default DraggableItem;