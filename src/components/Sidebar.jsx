import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Home, People, BarChart, DeveloperMode, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Sidebar({ onLogout }) {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: '#f4f4f4',
        },
      }}
    >
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <h2>PFW</h2>
      </div>
      <Divider />
      <List>
        {/* Home */}
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {/* Customers */}
        <ListItem button onClick={() => navigate('/customers')}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Customers" />
        </ListItem>
        {/* Reports */}
        <ListItem button onClick={() => navigate('/reports')}>
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
        {/* Developer */}
        <ListItem button onClick={() => navigate('/developer')}>
          <ListItemIcon>
            <DeveloperMode />
          </ListItemIcon>
          <ListItemText primary="Developer" />
        </ListItem>
      </List>
      <Divider />
      {/* Logout */}
      <List>
        <ListItem button onClick={onLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
