// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenu2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Customer Service Portal
        </Typography>
        <Button
          aria-controls="network-management-menu"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          Network Management
        </Button>
        <Menu
          id="network-management-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} component={Link} to="/service1">Service 1</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/service2">Service 2</MenuItem>
        </Menu>
        <Button
          aria-controls="projects-menu"
          aria-haspopup="true"
          onClick={handleMenu2}
          color="inherit"
        >
          Projects
        </Button>
        <Menu
          id="projects-menu"
          anchorEl={anchorEl2}
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
        >
          <MenuItem onClick={handleClose2} component={Link} to="/project1">Project 1</MenuItem>
          <MenuItem onClick={handleClose2} component={Link} to="/project2">Project 2</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;