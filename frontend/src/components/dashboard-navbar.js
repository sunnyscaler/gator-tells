import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Bell as BellIcon } from '../icons/bell';
import { UserCircle as UserCircleIcon } from '../icons/user-circle';
import { Users as UsersIcon } from '../icons/users';
import { AccountPopover } from './account-popover';
import { VoiceInput } from './general/voice-input';
import { useVoice } from '../hooks/useVoice';
import { useDataContext } from '../contexts/data-context';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;
  const settingsRef = useRef(null);
  const [openAccountPopover, setOpenAccountPopover] = useState(false);
  const [input, setInput] = useState("");
  const { text, isListening, listen, voiceSupported } = useVoice();
  const {setMode, setSelectedCountryIndicator, setSelectedCountry } = useDataContext()

  useEffect(() => {
    if(text) {
      setInput(text);
    }
  }, [text]);

  useEffect(() => {
    if(isListening) {
      setInput("Listening...");
    } else {
      setInput(text === "Listening..." ? "" : text);
      // if text has forecasting in it, set mode to forecasting
      if(text.toLowerCase().includes("forecasting")) {
        setMode("forecasting");
      } else {
        setMode("analysis");
      }

      if(text.toLowerCase().includes("north america")) {
        setSelectedCountry("North America");
      }

      if(text.toLowerCase().includes("emission")) {
        setSelectedCountryIndicator("CO2 emissions (metric tons per capita)");
      }

      if(text.toLowerCase().includes("coal") || text.toLowerCase().includes("call") || text.toLowerCase().includes("cold")) {
        setSelectedCountryIndicator("Coal rents (% of GDP)");
      }

    }
  }, [isListening]);

  const handleInputChanged = (event) => {
    setInput(event.target.value);
  };
  
  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <VoiceInput onChange={handleInputChanged} onClick={listen} isListening={isListening} text={input} />
          <Tooltip title="Contacts">
            <IconButton sx={{ ml: 1 }}>
              <UsersIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge
                badgeContent={4}
                color="primary"
                variant="dot"
              >
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          <Avatar
            onClick={() => setOpenAccountPopover(true)}
            ref={settingsRef}
            sx={{
              cursor: 'pointer',
              height: 40,
              width: 40,
              ml: 1
            }}
            src="/static/images/uf.png"
          >
            <UserCircleIcon fontSize="small" />
          </Avatar>
        </Toolbar>
      </DashboardNavbarRoot>
      <AccountPopover
        anchorEl={settingsRef.current}
        open={openAccountPopover}
        onClose={() => setOpenAccountPopover(false)}
      />
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
