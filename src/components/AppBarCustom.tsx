import { AppBar, Button, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react'

interface AppBarCustomProps {
    image: string | null;
    resetApp: () => void;
  }

const AppBarCustom: React.FC<AppBarCustomProps> = ({image, resetApp}) => {
    return (
        <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Test Task
          </Typography>
          <Tooltip
            title={image ? "" : "You need upload image"}
            arrow
          >
            <span>
                <Button
                    onClick={resetApp}
                    disabled={!image}
                    variant="outlined" 
                    color="inherit"
                >
                Reset IMAGE
                </Button>
            </span>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
}

export default AppBarCustom;