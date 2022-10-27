import {
  Box,
  TextField,
  InputAdornment,
  SvgIcon,
  IconButton,
} from '@mui/material'
import { Search as SearchIcon } from '../../icons/search'
import { Mic as MicIcon } from '@mui/icons-material'

export const VoiceInput = ({ onClick, isListening, text, onChange }) => (
  <Box sx={{ flexGrow: 1 }}>
    <TextField
      fullWidth
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              onClick={onClick}
              sx={{
                display: {
                  xs: 'inline-flex',
                },
              }}
            >
              <MicIcon className={isListening ? 'heartbeat': ''} color={isListening ? 'primary' : 'action'} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      placeholder="Search Gator sustainability datasets with voice"
      variant="outlined"
      value={text}
    />
  </Box>
)
