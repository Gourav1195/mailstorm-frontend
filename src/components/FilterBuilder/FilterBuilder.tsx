import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Typography,
  Alert,
  InputBase,
  styled,
} from "@mui/material";
import AllModal from "../Modals/AllModal";
import { DynamicIconProps } from '../../types/modal';
import { useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { AppDispatch } from "../../redux/store";
import { createCriteriaBlocks, getCriteriaBlocks, createOrUpdateFilter, getAudienceCount, getAudienceEstimate } from "../../api/apiClient";
import CriteriaBlockPanel from "./CriteriaBlockPanel";
import FilterCanvas from "./FilterCanvas";
import FilterSummary from "./FilterSummary";
import SaveFilterModal from "../Modals/SaveFilterModal";
import AddCriteriaModal from "./AddCriteriaModal";
import { DESIGN_SYSTEM } from "design/theme";

// Import interfaces and constants from separate files
import {
  FilterBuilderProps,
  Criteria,
  CriteriaBlockUI,
  AppliedCriteria,
} from "../../types/filter";
import { operators, operatorLabels, initialCriteriaTabs } from "./constants";

// Theme-aware styled components
const FilterContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  minWidth: "100%",
  backgroundColor: DESIGN_SYSTEM.modes[mode].colors.background,
  minHeight: '100vh',
  padding: '16px',
  transition: 'background-color 0.3s ease',
}));

const FilterHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: DESIGN_SYSTEM.modes[mode].colors.surface,
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.md,
  border: `1px solid ${DESIGN_SYSTEM.modes[mode].colors.border}`,
  boxShadow: DESIGN_SYSTEM.effects.shadows[mode].default,
}));

const HeaderTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  fontSize: DESIGN_SYSTEM.typography.scale.h3.fontSize,
  fontWeight: DESIGN_SYSTEM.typography.scale.h3.fontWeight,
  color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
  marginBottom: '8px',
}));

const HeaderSubtitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
  color: DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  lineHeight: 1.6,
}));

const EditModeInput = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'mode' && prop !== 'active'
})<{ mode: 'light' | 'dark'; active: boolean }>(({ mode, active }) => ({
  fontSize: active ? '28px' : '14px',
  fontWeight: active ? 600 : 400,
  color: DESIGN_SYSTEM.modes[mode].colors.textPrimary,
  backgroundColor: active ? `${DESIGN_SYSTEM.modes[mode].colors.primary}10` : 'transparent',
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.sm,
  padding: active ? '12px 16px' : '8px 12px',
  transition: 'all 0.2s ease',
  width: '100%',
  '&:hover': {
    backgroundColor: `${DESIGN_SYSTEM.modes[mode].colors.primary}08`,
  },
  '&:focus': {
    backgroundColor: `${DESIGN_SYSTEM.modes[mode].colors.primary}12`,
    outline: `2px solid ${DESIGN_SYSTEM.modes[mode].colors.primary}`,
    outlineOffset: '2px',
  },
}));

const SaveButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  backgroundColor: DESIGN_SYSTEM.modes[mode].colors.primary,
  color: '#FFFFFF',
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.sm,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
  border: `1px solid ${DESIGN_SYSTEM.modes[mode].colors.primary}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: DESIGN_SYSTEM.modes[mode].colors.primaryLight,
    transform: 'translateY(-1px)',
    boxShadow: DESIGN_SYSTEM.effects.shadows[mode].glow,
  },
  '&:disabled': {
    backgroundColor: `${DESIGN_SYSTEM.modes[mode].colors.textTertiary}40`,
    borderColor: DESIGN_SYSTEM.modes[mode].colors.border,
    color: DESIGN_SYSTEM.modes[mode].colors.textTertiary,
  },
}));

const DiscardButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  backgroundColor: 'transparent',
  color: DESIGN_SYSTEM.modes[mode].colors.textSecondary,
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.sm,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
  border: `1px solid ${DESIGN_SYSTEM.modes[mode].colors.border}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: `${DESIGN_SYSTEM.modes[mode].colors.primary}08`,
    borderColor: DESIGN_SYSTEM.modes[mode].colors.primary,
    color: DESIGN_SYSTEM.modes[mode].colors.primary,
  },
}));

const DraftButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mode'
})<{ mode: 'light' | 'dark' }>(({ mode }) => ({
  backgroundColor: `${DESIGN_SYSTEM.modes[mode].colors.accent}20`,
  color: DESIGN_SYSTEM.modes[mode].colors.accent,
  borderRadius: DESIGN_SYSTEM.effects.borderRadius.sm,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: DESIGN_SYSTEM.typography.scale.body2.fontSize,
  border: `1px solid ${DESIGN_SYSTEM.modes[mode].colors.accent}40`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: `${DESIGN_SYSTEM.modes[mode].colors.accent}30`,
    borderColor: DESIGN_SYSTEM.modes[mode].colors.accent,
    transform: 'translateY(-1px)',
  },
}));

const MainContent = styled(Box)({
  display: "flex",
  gap: "24px",
  padding: "0 16px",
  flexWrap: 'wrap',
  '@media (max-width: 1200px)': {
    flexDirection: 'column',
  },
});

// Main component
const FilterBuilder: React.FC<FilterBuilderProps> = ({
  mode: propMode = "create",
  initialData,
  onSave,
  onDiscard,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Get theme mode from Redux
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  const [groupsByTab, setGroupsByTab] = useState<{ [tab: string]: any[] }>({});
  const [groupOperatorsByTab, setGroupOperatorsByTab] = useState<{ [tab: string]: { [groupId: number]: string } }>({});
  const [logicalOperatorsByTab, setLogicalOperatorsByTab] = useState<{ [tab: string]: { [index: number]: "AND" | "OR" } }>({
    Tab1: {},
    Tab2: {},
  });

  const [activeTab, setActiveTab] = useState<string>("Tab1");
  const [createBlockError, setCreateBlockError] = useState<string>("");
  const [saveFilterName, setSaveFilterName] = useState("");
  const [saveDescription, setSaveDescription] = useState("");
  const [saveTags, setSaveTags] = useState("");
  const [isSaveFilterModalOpen, setIsSaveFilterModalOpen] = useState(false);
  const [estimatedAudience, setEstimatedAudience] = useState<number>(0); 
  const [criteriaTabs, setCriteriaTabs] = useState<Record<string, CriteriaBlockUI[]>>(initialCriteriaTabs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCriteria, setNewCriteria] = useState<Criteria>({
    key: null,
    label: "",
    dataType: "string",
    operator: "",
    operators: []
  });

  const [validationError, setValidationError] = useState<{ criteria: string[], filter: string[], main: string[] }>({ criteria: [], filter: [], main: [] });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isTypingFields, setIsTypingFields] = useState<{
    name: boolean;
    description: boolean;
    tags: boolean;
  }>({
    name: false,
    description: false,
    tags: false,
  })
  const [modalData, setModalData] = useState<{
    open: boolean;
    handleConfirm: () => void | ((id: string) => void) | (() => void);
    title: string; message: string;
    btntxt: string;
    icon: DynamicIconProps | undefined;
    color: string; handleClose: () => void;
  }>({
    open: false,
    handleConfirm: () => { },
    title: '',
    message: '',
    btntxt: '',
    icon: undefined,
    color: '',
    handleClose: () => { },
  });
  const estimateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

const triggerAudienceEstimate = (payload:any) => {
  if (estimateTimeoutRef.current) {
    clearTimeout(estimateTimeoutRef.current);
  }

  estimateTimeoutRef.current = setTimeout(async () => {
    try {
      const res = await getAudienceEstimate(payload);
      console.log("//////////////Estimate response:", res);
      setEstimatedAudience(res ?? 0);
    } catch (e) {
      console.error("Estimate failed", e);
    }
  }, 600); // sweet spot
};
  
  useEffect(() => {
  const groups = groupsByTab[activeTab];
  if (!groups || groups.length === 0) return;

  const payload = {
    conditions: groups.map((group, index) => ({
      groupId: group.groupId || index,
      groupOperator: groupOperatorsByTab[activeTab]?.[group.id] || "AND",
      criteria: group.criteria.map((c: any) => ({
        field: c.key,
        operator: c.operator,
        value: c.value,
      })),
    })),
    logicalOperator:
      groups.length > 1
        ? logicalOperatorsByTab[activeTab]?.[1] || "OR"
        : "AND",
  };

  triggerAudienceEstimate(payload);
}, [
  groupsByTab,
  groupOperatorsByTab,
  logicalOperatorsByTab,
  activeTab,
]);


  useEffect(() => {
    if (propMode === "edit" && initialData) {
      setSaveFilterName(initialData.name || "");
      setSaveDescription(initialData.description || "");
      setSaveTags((initialData.tags || []).join(", "));
      const tabKey = initialData.isTriggerFilter ? "Tab2" : "Tab1";
      const groups = initialData.groups || [];

      const formattedGroups = groups.map((group: any) => ({
        id: group.groupId,
        criteria: Array.isArray(group.conditions)
          ? group.conditions.map((c: any) => {
              const found = [...criteriaTabs.Tab1, ...criteriaTabs.Tab2]
                .find((item) => item.label === c.field);

              return {
                key: c.field,
                label: c.field,
                operator: c.operator,
                value: c.value,
                dataType: found?.dataType || "string",
                availableOperators: found?.operators || [],
              };
            })
          : [],
      }));

      const groupOps: any = {};
      const logicOps: any = {};

      groups.forEach((group: any, index: number) => {
        groupOps[group.groupId] = group.groupOperator;
        if (index > 0) logicOps[index] = initialData.logicalOperator || "OR";
      });

      setGroupsByTab({ [tabKey]: formattedGroups });
      setGroupOperatorsByTab({ [tabKey]: groupOps });
      setLogicalOperatorsByTab({ [tabKey]: logicOps });
      setActiveTab(tabKey);
    }
  }, [initialData, propMode]);

  let mainError: string[] = []

  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('isRedirect');
  const isRedirect = redirect === 'true';

  const handleClose = () => {
    setModalData(prev => ({ ...prev, open: false }))
  }

  const handleExit = () => {
    if (isRedirect) {
      navigate("/create-campaign", { state: { step: 1 } });
    }
    else {
      navigate("/filters?isDraft=false");
    }
  }
  const handleDraftExit = () => {
    navigate("/filters?isDraft=true");
  }

  const handleBlockSuccess = () => {
    setModalData({
      open: true,
      handleConfirm: handleClose,
      title: 'Success',
      message: `"${newCriteria.label}" Criteria Block Saved Successfully`,
      handleClose: handleClose,
      btntxt: "Ok",
      icon: { type: "success" } as DynamicIconProps,
      color: "primary"
    });
  }

  const handleSuccess = () => {
    setModalData({
      open: true,
      handleConfirm: handleExit,
      title: 'Success',
      message: `"${saveFilterName}" Filter Saved Successfully`,
      handleClose: handleClose,
      btntxt: "Ok",
      icon: { type: "success" } as DynamicIconProps,
      color: "primary"
    });
  }

  const handleEditSuccess = () => {
    setModalData({
      open: true,
      handleConfirm: handleExit,
      title: 'Success',
      message: `"${saveFilterName}" Filter Updated Successfully`,
      handleClose: handleClose,
      btntxt: "Ok",
      icon: { type: "success" } as DynamicIconProps,
      color: "primary"
    });
  }

  const handleDiscard = () => {
      setModalData({
        open: true,
        handleConfirm: handleExit,
        title: 'Exit Filters',
        message: 'You have unsaved changes. Do you really want to leave?',
        handleClose: handleClose,
        btntxt: "Discard",
        icon: { type: "cancel" } as DynamicIconProps,
        color: "warning"
      });
    };

  const handleDraft = () => {
    setModalData({
      open: true,
      handleConfirm: handleDraftExit,
      title: 'Success',
      message: `Draft Saved Successfully`,
      handleClose: handleClose,
      btntxt: "Ok",
      icon: { type: "success" } as DynamicIconProps,
      color: "primary"
    });
  }

  const addGroup = () => {
    setGroupsByTab((prev) => {
      const currentGroups = prev[activeTab] || [];
      const newGroupId = currentGroups.length;
      return {
        ...prev,
        [activeTab]: [...currentGroups, { id: newGroupId, criteria: [] }],
      };
    });
    setGroupOperatorsByTab((prev) => {
      const currentGroupOperators = prev[activeTab] || {};
      return {
        ...prev,
        [activeTab]: { ...currentGroupOperators, [groupsByTab[activeTab]?.length || 0]: "AND" },
      };
    });
  };

  const handleDrop = (criteria: CriteriaBlockUI, groupId: number) => {
    setGroupsByTab((prev) => {
      const updatedGroups = prev[activeTab].map((group) => {
        if (group.id === groupId) {
          if (group.criteria.some((c: CriteriaBlockUI) => c.label === criteria.label)) {
            mainError.push(`Cannot drag "${criteria.label}" as it already exists in this group.`);
            setValidationError(prev => ({
              ...prev,
              main: [...prev.main, ...mainError]
            }));
            setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
            return group;
          }
          return {
            ...group,
            criteria: [
              ...group.criteria,
              {
                key: criteria.key!,
                label: criteria.label,
                dataType: criteria.dataType,
                operator: criteria.operators[0], 
                availableOperators: criteria.operators,
                value: "",
              },
            ],
          };
        }
        return group;
      });
      return { ...prev, [activeTab]: updatedGroups };
    });
  };

  const handleUpdateItem = (
    criteriaLabel: string,
    groupId: number,
    field: keyof AppliedCriteria,
    value: string
  ) => {
    setGroupsByTab((prev) => {
      const updatedGroups = prev[activeTab].map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            criteria: group.criteria.map((item: AppliedCriteria) => {
              if (item.label === criteriaLabel) {
                return { ...item, [field]: value };
              }
              return item;
            }),
          };
        }
        return group;
      });
      return {
        ...prev,
        [activeTab]: updatedGroups,
      };
    });
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    const currentGroups = groupsByTab[activeTab] || [];
    if (currentGroups.some((group) => group.criteria.length > 0)) {
      mainError.push("As already added 1 block, cannot switch tab");
      setValidationError(prev => ({
        ...prev,
        main: [...prev.main, ...mainError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
      return;
    }
    setActiveTab(newValue);
  };

  const handleOpenModal = (tab: string) => {
    setActiveTab(tab);
    setNewCriteria({ key: null, label: "", dataType: "string" , operator:"equals", operators: []});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  let criteriaError: string[] = [];

  const handleSaveCriteria = () => {

    if (!["string", "date", "number"].includes(newCriteria.dataType)) {
      criteriaError.push('Data Type is required.');
    }

    if (!newCriteria.label.trim()) {
      criteriaError.push('Block Name is required.');
    }

    if (!newCriteria.operator) {
      criteriaError.push('Operator field is required.');
    }

    if (!/^[a-zA-Z0-9\s]{3,30}$/.test(newCriteria.label)) {
      criteriaError.push('Block name should be 3-30 characters and contain only valid characters.');
    }

    if (criteriaError.length > 0) {
      setValidationError(prev => ({
        ...prev,
        criteria: [...prev.criteria, ...criteriaError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, criteria: [] })), 6000);
      return;
    }
    
    const generatedKey = newCriteria.label.trim().toLowerCase().replace(/\s+/g, '_');
    createCriteriaBlocks({
      key: generatedKey,
      label: newCriteria.label,
      type: newCriteria.dataType,
      category: activeTab === "Tab1" ? "filterComponent" : "triggerFilter",
      operators: [newCriteria.operator]
    })
      .then((res) => {
        handleBlockSuccess();
        fetchBlocks();
        handleCloseModal();
      })
      .catch((err) => {
        console.log("err", err);
        handleCloseModal();
      });
  };

  const handleDeleteGroup = (groupId: number) => {
    setGroupsByTab((prev) => {
      const updatedGroups = prev[activeTab].filter((group) => group.id !== groupId);
      return { ...prev, [activeTab]: updatedGroups };
    });

    setGroupOperatorsByTab((prev) => {
      const updated = { ...prev[activeTab] };
      delete updated[groupId];
      return { ...prev, [activeTab]: updated };
    });
  };

  const handleRemoveItem = (criteriaLabel: string, groupId: number) => {
    setGroupsByTab((prev) => {
      const updatedGroups = prev[activeTab].map((group: any) => {
        if (group.id === groupId) {
          const updatedCriteria = group.criteria.filter(
            (item: any) => item.label !== criteriaLabel
          );
          return { ...group, criteria: updatedCriteria };
        }
        return group;
      });
      return { ...prev, [activeTab]: updatedGroups };
    });
  };

  const fetchBlocks = () => {
    getCriteriaBlocks().then((res) => {
      const tab1Data: any = [];
      const tab2Data: any = [];
      
      res.data.data.forEach((item: any) => {
        const criteriaObj = {
          key: item.key,
          label: item.label,
          dataType: item.type,
          operators: item.operators || [],
        };

        if (item.category === "filterComponent") {
          tab1Data.push(criteriaObj);
        } else if (item.category === "triggerFilter") {
          tab2Data.push(criteriaObj);
        }
      });

      setCriteriaTabs({
        Tab1: tab1Data,
        Tab2: tab2Data,
      });
    });
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleSaveFilter = () => {
    const groups = groupsByTab[activeTab];

    if (!groups || groups.length === 0) {
      mainError.push("Please create at least one group before saving.");
    }
    if (mainError.length > 0) {
      setValidationError(prev => ({
        ...prev,
        main: [...prev.main, ...mainError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
      return;
    }

    for (const group of groups) {
      if (!group.criteria || group.criteria.length === 0) {
        mainError.push("Each group must have at least one criteria block.");
      }
      for (const criteria of group.criteria) {
        if (!criteria.value || criteria.value.trim() === "") {
          mainError.push(`Please fill all input values inside Group ${group.id + 1}.`);
        }
      }
    }

    if (mainError.length > 0) {
      setValidationError(prev => ({
        ...prev,
        main: [...prev.main, ...mainError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
      return;
    }

    setSaveFilterName("");
    setSaveDescription("");
    setSaveTags("");
    setIsSaveFilterModalOpen(true);
  };

  let confirmFilterError: string[] = [];

  const handleConfirmSaveFilter = async () => {
    if (!saveFilterName.trim() || saveFilterName.trim().length < 3 || saveFilterName.trim().length > 40 || !/[a-zA-Z0-9]/.test(saveFilterName)) {
      if (propMode === "create") {
        confirmFilterError.push("Filter name must be 3 to 40 characters and include at least one letter or number.");
      }
      else {
        mainError.push("Filter name must be 3 to 40 characters and include at least one letter or number.");
      }
    }
    if (
      propMode === 'edit' &&
      saveFilterName.trim().toLowerCase().startsWith('copy')
    ) {
      mainError.push("Filter name can't start with 'Copy'");
    }

    if (!saveDescription.trim() || !/[a-zA-Z0-9]/.test(saveDescription)) {
      if (propMode === "create") {
        confirmFilterError.push("Description is required and should contain either one letter or number.");
      } else {
        mainError.push("Description is required and should contain either one letter or number.");
      }
    }

    const groups = groupsByTab[activeTab];
    if (!groups || groups.length === 0) {
      if (propMode === 'create') {
        confirmFilterError.push("Please create at least one group before saving.");
      } else {
        mainError.push("Please create at least one group before saving.");
      }
    }
    if (groups) {
      for (const group of groups) {
        if (!group.criteria || group.criteria.length === 0) {
          confirmFilterError.push("Each group must have at least one criteria block.");
        }
        for (const criteria of group.criteria) {
          if (!criteria.value || criteria.value.trim() === "") {
            confirmFilterError.push(`Please fill all input values inside Group ${group.id + 1}.`);
          }
        }
      }
    }

    if (mainError.length > 0) {
      setValidationError(prev => ({
        ...prev,
        main: [...prev.main, ...mainError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
      return;
    }

    if (confirmFilterError.length > 0) {
      setValidationError(prev => ({
        ...prev,
        filter: [...prev.filter, ...confirmFilterError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, filter: [] })), 6000);
      return;
    }

    const conditions = groups.map((group, index) => {
      if (!group.groupId) {
        group.groupId = `group-${Date.now()}-${index}`;
      }

      return {
        groupId: group.groupId,
        groupOperator: groupOperatorsByTab[activeTab]?.[group.id] || "AND",
        criteria: group.criteria.map((criteria: any) => ({
          field: criteria.key,
          operator: criteria.operator,
          value: criteria.value,
        })),
      };
    });

    const payload = {
      name: saveFilterName.trim(),
      description: saveDescription.trim(),
      tags: saveTags.split(",").map((tag) => tag.trim()).filter(tag => tag),
      conditions,
      customFields: { region: "North America", campaign: "Summer Sale" },
      isDraft: false,
      isTriggerFilter: activeTab === "Tab2" ? true : false, 
      logicalOperator:
        conditions.length > 1
          ? logicalOperatorsByTab[activeTab]?.[1] || "OR"
          : undefined,
      estimatedAudience,
    };

    try {
      if (propMode === "edit" && onSave) {
        onSave(payload);
        handleEditSuccess();
      } else {
        await createOrUpdateFilter(payload);
        handleSuccess();
      }
    } catch (error) {
      console.error("Error saving filter:", error);
      setIsSaveFilterModalOpen(false);
    }
  };

  const handleSaveDraftFilter = async () => {
    const groups = groupsByTab[activeTab];

    if (!groups || groups.length === 0) {
      mainError.push("Please create at least one group before saving.");
    }
    if (mainError.length > 0) {
      setValidationError(prev => ({
        ...prev,
        main: [...prev.main, ...mainError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
      return;
    }
    for (const group of groups) {
      if (!group.criteria || group.criteria.length === 0) {
        mainError.push("Each group must have at least one criteria block.");
      }
      for (const criteria of group.criteria) {
        if (!criteria.value || criteria.value.trim() === "") {
          mainError.push(`Please fill all input values inside Group ${group.id + 1}.`);
        }
      }
    }

    if (mainError.length > 0) {
      setValidationError(prev => ({
        ...prev,
        main: [...prev.main, ...mainError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
      return;
    }

    const conditions = groups.map((group, index) => {
      if (!group.groupId) {
        group.groupId = `group-${Date.now()}-${index}`;
      }

      return {
        groupId: group.groupId,
        groupOperator: groupOperatorsByTab[activeTab]?.[group.id] || "AND",
        criteria: group.criteria.map((criteria: any) => ({
          field: criteria.key,
          operator: criteria.operator,
          value: criteria.value,
        })),
      };
    });

    const payload = {
      name: saveFilterName.trim() || "Untitled Draft",
      description: saveDescription.trim() || "Draft Description",
      tags: saveTags.split(",").map((tag) => tag.trim()).filter(tag => tag),
      conditions,
      customFields: { region: "North America", campaign: "Summer Sale" },
      isDraft: true,
      logicalOperator:
        conditions.length > 1
          ? logicalOperatorsByTab[activeTab]?.[1] || "OR"
          : undefined,
      estimatedAudience,
    };

    try {
      await createOrUpdateFilter(payload);
      handleDraft();
    } catch (error) {
      console.error("Error saving draft:", error);
      setIsSaveFilterModalOpen(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <FilterContainer mode={themeMode}>
        {/* Header Section */}
        <FilterHeader mode={themeMode}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2 
          }}>
            <Box sx={{ flex: 1 }}>
              {propMode === 'create' ? (
                <>
                  <HeaderTitle mode={themeMode}>
                    Build Your Audience Filter
                  </HeaderTitle>
                  <HeaderSubtitle mode={themeMode}>
                    Use the tools below to define the exact audience you want to target. 
                    Drag, drop, or select options to create powerful filters with ease.
                  </HeaderSubtitle>
                </>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <EditModeInput
                    mode={themeMode}
                    active={isTypingFields.name}
                    placeholder="Filter Name"
                    value={saveFilterName}
                    onChange={(e) => setSaveFilterName(e.target.value)}
                    onFocus={() => setIsTypingFields(prev => ({ ...prev, name: true }))}
                    onBlur={() => setIsTypingFields(prev => ({ ...prev, name: false }))}
                  />
                  <EditModeInput
                    mode={themeMode}
                    active={isTypingFields.description}
                    placeholder="Description"
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    onFocus={() => setIsTypingFields(prev => ({ ...prev, description: true }))}
                    onBlur={() => setIsTypingFields(prev => ({ ...prev, description: false }))}
                    multiline
                    minRows={2}
                  />
                  <EditModeInput
                    mode={themeMode}
                    active={isTypingFields.tags}
                    placeholder="Tags (comma separated)"
                    value={saveTags}
                    onChange={(e) => setSaveTags(e.target.value)}
                    onFocus={() => setIsTypingFields(prev => ({ ...prev, tags: true }))}
                    onBlur={() => setIsTypingFields(prev => ({ ...prev, tags: false }))}
                  />
                </Box>
              )}
            </Box>

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              {propMode === "edit" ? (
                <>
                  <DiscardButton 
                    mode={themeMode}
                    onClick={handleDiscard}
                    startIcon={<DeleteIcon />}
                  >
                    Discard
                  </DiscardButton>
                  <SaveButton 
                    mode={themeMode}
                    onClick={handleConfirmSaveFilter}
                    startIcon={<SaveIcon />}
                  >
                    Save Changes
                  </SaveButton>
                </>
              ) : (
                <SaveButton 
                  mode={themeMode}
                  onClick={handleSaveFilter}
                  startIcon={<SaveIcon />}
                >
                  Save Filter
                </SaveButton>
              )}
            </Box>
          </Box>

          {validationError.main.length > 0 && (
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 2,
                backgroundColor: `${DESIGN_SYSTEM.modes[themeMode].colors.warningBg}`,
                color: DESIGN_SYSTEM.modes[themeMode].colors.warning,
                border: `1px solid ${DESIGN_SYSTEM.modes[themeMode].colors.warning}40`,
              }}
            >
              {validationError.main[validationError.main.length - 1]}
            </Alert>
          )}
        </FilterHeader>

        {/* Main Content Area */}
        <MainContent>
          <CriteriaBlockPanel
            mode={themeMode}
            activeTab={activeTab}
            criteriaTabs={criteriaTabs}
            searchTerm={searchTerm}
            onTabChange={handleTabChange}
            onSearchChange={setSearchTerm}
            onAddCustomField={handleOpenModal}
          />

          <FilterCanvas
            mode={themeMode}
            activeTab={activeTab}
            groupsByTab={groupsByTab}
            groupOperatorsByTab={groupOperatorsByTab}
            logicalOperatorsByTab={logicalOperatorsByTab}
            onAddGroup={addGroup}
            onDeleteGroup={handleDeleteGroup}
            onDrop={handleDrop}
            onRemoveItem={handleRemoveItem}
            onUpdateItem={handleUpdateItem}
            onGroupOperatorChange={(groupId, value) =>
              setGroupOperatorsByTab(prev => ({
                ...prev,
                [activeTab]: { ...prev[activeTab], [groupId]: value }
              }))
            }
            onLogicalOperatorChange={(index, value) =>
              setLogicalOperatorsByTab(prev => ({
                ...prev,
                [activeTab]: { ...prev[activeTab], [index]: value }
              }))
            }
          />

          <FilterSummary 
            mode={themeMode}
            estimatedAudience={estimatedAudience} 
          />
        </MainContent>

        {/* Draft Button for create mode */}
        {propMode === 'create' && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            mt: 3,
            px: 3 
          }}>
            <DraftButton
              mode={themeMode}
              onClick={handleSaveDraftFilter}
              startIcon={<SaveIcon />}
            >
              Save Draft
            </DraftButton>
          </Box>
        )}

        {/* Modals */}
        <SaveFilterModal
          mode={themeMode}
          open={isSaveFilterModalOpen}
          saveFilterName={saveFilterName}
          saveDescription={saveDescription}
          saveTags={saveTags}
          validationError={validationError}
          onClose={() => setIsSaveFilterModalOpen(false)}
          onSave={handleConfirmSaveFilter}
          onFilterNameChange={setSaveFilterName}
          onDescriptionChange={setSaveDescription}
          onTagsChange={setSaveTags}
        />

        <AddCriteriaModal
          mode={themeMode}
          open={isModalOpen}
          newCriteria={newCriteria}
          validationError={validationError}
          createBlockError={createBlockError}
          operators={operators}
          operatorLabels={operatorLabels}
          onClose={handleCloseModal}
          onSave={handleSaveCriteria}
          onCriteriaChange={(field, value) =>
            setNewCriteria({ ...newCriteria, [field]: value })
          }
        />

        {/* Keep the existing AllModal */}
        <AllModal
          open={modalData.open}
          handleClose={modalData.handleClose}
          handleConfirm={modalData.handleConfirm}
          title={modalData.title}
          message={modalData.message}
          btntxt={modalData.btntxt}
          icon={modalData.icon}
          color={modalData.color}
        />
      </FilterContainer>
    </DndProvider>
  );
};

export default FilterBuilder;