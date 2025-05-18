import React, { useState, useEffect } from "react";
import {
  Menu as MenuIcon,
  Search,
  ArrowDropDownOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  NotificationsOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  Popover,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Badge, // Import Badge
} from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMode } from "../state";
import FlexBetween from "./FlexBetween";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import SettingsButton from "./SettingsButton";
import { useTranslation } from "react-i18next";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout, user } = useUserContext();

  const backgroundImages = [
    "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBRDvFDRT7yqonhHtrBE2qcdhDDx19ylOm5A&s')",
    "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXQJGXwlhVmg9n0HVYWEUHm4I85DLMXPBT4Q&s')",
    "url('https://isafe-safety.co.uk/wp-content/uploads/2024/02/workplace-safety-training.png')",
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const isNotificationOpen = Boolean(notificationAnchorEl);
  const handleNotificationClick = (event) => setNotificationAnchorEl(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchorEl(null);

  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Changement cyclique du background
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Chargement des notifications
  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patrols/upcoming-deadlines", {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          }
        });

        if (!Array.isArray(response.data)) {
          throw new Error("La réponse n'est pas une liste de deadlines");
        }

        // Vérifier que chaque élément a les propriétés attendues
        const validDeadlines = response.data.filter(
          (item) => item.message && item.deadline
        );

        setUpcomingDeadlines(validDeadlines);
      } catch (error) {
        console.error("Error loading notifications :", error);
        setError(error.response?.data?.message || error.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundImage: backgroundImages[backgroundIndex],
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        boxShadow: "none",
        height: "30%",
        borderRadius: "0 0 20px 20px",
        overflow: "hidden",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          position: "relative",
          padding: "0.1rem 1.5rem",
          gap: "3rem",
        }}
      >
        {/* CÔTÉ GAUCHE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>

          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder={t("Search...")} />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* CÔTÉ DROIT */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>

          <SettingsButton />

          {/* Menu utilisateur */}
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
  <Typography
    fontWeight="bold"
    fontSize="0.85rem"
    sx={{ color: theme.palette.secondary[100] }}
  >
  </Typography>
 <Box textAlign="left">
  <Typography
    fontWeight="bold"
    fontSize="0.85rem"
    sx={{ color: theme.palette.secondary[100] }}
  >
  </Typography>
  <Typography
    fontSize="0.75rem"
    sx={{ color: theme.palette.secondary[200] }}
  >
  </Typography>
</Box>

</Box>

              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleLogout}>{t("Log out")}</MenuItem>
            </Menu>

            {/* Notifications */}
            <Badge
  badgeContent={upcomingDeadlines.length}
  color="error"
  overlap="circular"
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
>
  <IconButton onClick={handleNotificationClick}>
    <NotificationsOutlined sx={{ fontSize: "40px", color: "yellow" }} />
  </IconButton>
</Badge>


            <Popover
              anchorEl={notificationAnchorEl}
              open={isNotificationOpen}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box sx={{ width: "300px", padding: "10px" }}>
                <Typography variant="h6">{t("Notifications")}</Typography>
                {loading ? (
                  <CircularProgress size={24} sx={{ marginTop: "10px" }} />
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : upcomingDeadlines.length === 0 ? (
                  <Typography>{t("No upcoming deadlines")}</Typography>
                ) : (
                  <List>
                    {upcomingDeadlines.map((deadline) => (
                      <ListItem key={deadline._id} sx={{ padding: "5px 0" }}>
                        <ListItemText
                          primary={deadline.message}
                          secondary={new Date(deadline.deadline).toLocaleDateString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Popover>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
