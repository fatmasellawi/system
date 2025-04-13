import React, { useState } from 'react';
import {Box, useMediaQuery } from "@mui/material";
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
/*import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';

import FlexBetween from '../../components/FlexBetween';*/

import Sidebar from '../../components/Sidebar';
const Layout = () => {

  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // ou false selon le besoin
  return (
 <Box  diplay = {isNonMobile ? "flex" : "block" }width= "100%" height= "100%" sx={{ display: "flex"}}>
  <Sidebar 
  isNonMobile= {isNonMobile}
  drawerWidth = "250px"
  isSidebarOpen = {isSidebarOpen}
  setIsSidebarOpen = {setIsSidebarOpen}/>
    <Box>
        <Navbar 
         isSidebarOpen = {isSidebarOpen}
         setIsSidebarOpen = {setIsSidebarOpen}
        />
        <Outlet/>
    </Box>

 </Box> 
  )
}

export default Layout