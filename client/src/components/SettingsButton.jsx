import React, { useState } from "react";
import { SettingsOutlined } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { setMode } from "../state"; // Exemple d'action pour changer le mode (sombre/clair)
import i18next from "i18next"; // Import de i18next pour changer la langue

const SettingsButton = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeMode = () => {
    dispatch(setMode()); // Changer de mode (sombre/clair)
    handleClose(); // Fermer le menu
  };

  const handleLanguageChange = (language) => {
    i18next.changeLanguage(language); // Change la langue de l'application
    handleClose(); // Fermer le menu après avoir choisi
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SettingsOutlined sx={{ fontSize: "25px" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Option de changement de mode (sombre/clair) */}
        <MenuItem onClick={handleChangeMode}>
          <Typography variant="body2">
            {theme.palette.mode === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          </Typography>
        </MenuItem>

        {/* Option de changement de langue */}
        <MenuItem onClick={() => handleLanguageChange("fr")}>
          <Typography variant="body2">Français</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange("en")}>
          <Typography variant="body2">English</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default SettingsButton;
