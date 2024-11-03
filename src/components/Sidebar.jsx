// Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Home, AttachMoney, People, BarChart, Settings, DeveloperMode, ExitToApp } from '@mui/icons-material';

function Sidebar() {
  return (
    <Drawer variant="permanent" anchor="left" className="sidebar">
      <div className="sidebar__header">
        <h2>PFW</h2>
      </div>
      <List>
        {[
          { text: 'Overview', icon: <Home /> },
          { text: 'Transactions', icon: <AttachMoney /> },
          { text: 'Customers', icon: <People /> },
          { text: 'Reports', icon: <BarChart /> },
          { text: 'Settings', icon: <Settings /> },
          { text: 'Developer', icon: <DeveloperMode /> },
        ].map((item, index) => (
          <ListItem button key={index} className="sidebar__item">
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem button className="sidebar__logout">
        <ListItemIcon><ExitToApp /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </Drawer>
  );
}

export default Sidebar;
