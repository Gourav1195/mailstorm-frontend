import React from 'react';
 
import { MonitorOutlined, PhoneIphoneOutlined } from '@mui/icons-material';
import { Box, Card, Stack, SxProps, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Reader } from '@usewaypoint/email-builder';
 
import EditorBlock from '../../documents/editor/EditorBlock';
import {
  setSelectedScreenSize,
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
  useSetDocument ,
  useHtmlCode,
} from '../../documents/editor/EditorContext';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import ToggleSamplesPanelButton from '../SamplesDrawer/ToggleSamplesPanelButton';
 
import DownloadJson from './DownloadJson';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';
import ShareButton from './ShareButton';
import SaveButton from '../BlockDrawer/SaveButton';
// import EmailLayoutEditor from '../../documents/blocks/EmailLayout/EmailLayoutEditor';
import { TEditorBlock } from '../../documents/editor/core';
import { Template } from 'types/template';
 
type HtmlBlock = Extract<TEditorBlock, { type: 'Html' }>;
type TemplatePanelProps = {
  templateDetails:Template;
  setTemplateDetails: React.Dispatch<React.SetStateAction<Template>>;
  isEdit: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
 
}
 
 
export default function TemplatePanel({templateDetails, setTemplateDetails, isEdit, setError, setIsEditMode}:TemplatePanelProps) {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();
  const htmlCode = useHtmlCode();
  const setDocument = useSetDocument();
  React.useEffect(() => {
   
    if (document.root.type !== 'Html') return;
    const htmlBlock = document.root as HtmlBlock;
    setDocument({
      root: {
        ...htmlBlock,
        data: {
          ...htmlBlock.data,            
          props: {
            ...(htmlBlock.data.props ?? {}),
            contents: htmlCode,            
          },
        },
      },
    });
  }, [htmlCode, document.root, setDocument]);
 
  let mainBoxSx: SxProps = {
    height: '100%',
  };
  if (selectedScreenSize === 'mobile') {
    mainBoxSx = {
      ...mainBoxSx,
      margin: '32px auto',
      width: 370,
      height: 800,
      boxShadow:
        'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px',
    };
  }
  const handleScreenSizeChange = (_: unknown, value: unknown) => {
    switch (value) {
      case 'mobile':
      case 'desktop':
        setSelectedScreenSize(value);
        return;
      default:
        setSelectedScreenSize('desktop');
    }
  };
  const renderMainPanel = () => {
    switch (selectedMainTab) {
      case 'editor':
        return (
          <Box sx={mainBoxSx}>
            {/* editor-only */}
            <EditorBlock id="root" />
          </Box>
        );  
      case 'preview':
        return (
          <Box sx={mainBoxSx}>
            {/* full “Reader” preview */}
            <Reader document={document} rootBlockId="root" />
          </Box>
        );
      case 'html':
        return (
           <HtmlPanel />
        );  
      case 'json':
        return <JsonPanel />;
    }
  };
  return (
    <>
      <Stack
  direction="row"
  alignItems="center"
  justifyContent="space-between"
  sx={{
    height: 99,
    borderBottom: 1,
    borderColor: 'divider',
    bgcolor: '#F7F9FF',
    position: 'sticky',
    top: 0,
    zIndex: 'appBar',
    px: 1,
    overflowX: 'hidden',
  }}
>
  {/* LEFT */}
  <ToggleSamplesPanelButton />
 
  {/* CENTER - make it scrollable horizontally if it overflows */}
  <Box
    sx={{
      display: 'flex',
      overflowX: 'auto',
      mx: 2,
      flex: 1,
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center" minWidth="max-content">
      <MainTabsGroup />
      <DownloadJson />
      <ImportJson />
      <Card
        sx={{
          p: 0.7,
          borderRadius: '6px',
          boxShadow: '0px 1px 0px 2px #00000040',
        }}
      >
        <ToggleButtonGroup
          value={selectedScreenSize}
          exclusive
          size="small"
          onChange={handleScreenSizeChange}
          sx={{ border: 'none' }}
        >
          <ToggleButton value="desktop" sx={{ border: 'none' }}>
            <Tooltip title="Desktop view">
              <MonitorOutlined sx={{ fontSize: '26px' }} />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="mobile" sx={{ border: 'none' }}>
            <Tooltip title="Mobile view">
              <PhoneIphoneOutlined sx={{ fontSize: '26px' }} />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Card>
      <ShareButton />
      <SaveButton
        TemplateDetails={templateDetails}
        setTemplateDetails={setTemplateDetails}
        isEdit={isEdit}
        setError={setError}
        setIsEditMode={setIsEditMode}
      />
    </Stack>
  </Box>
 
  {/* RIGHT */}
  <ToggleInspectorPanelButton />
</Stack>
 
      <Box sx={{ height: 'calc(100vh - 49px)', overflow: 'auto', minWidth: 370, bgcolor:'#F5F5F5' }}>{renderMainPanel()}</Box>
    </>
  );
}
 
 