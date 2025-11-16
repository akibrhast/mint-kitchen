import React from "react";
import {
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/Place";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PhoneIcon from "@mui/icons-material/Phone";
import TextsmsIcon from "@mui/icons-material/Textsms";

export default function ContactWithOptions() {
  const address = "221 Carlton Rd, Charlottesville, VA 22902";
  const phone = "+14342296121";

  const [addressAnchor, setAddressAnchor] = React.useState(null);
  const [phoneAnchor, setPhoneAnchor] = React.useState(null);

  const openAddressMenu = (e) => setAddressAnchor(e.currentTarget);
  const openPhoneMenu = (e) => setPhoneAnchor(e.currentTarget);
  const closeAddressMenu = () => setAddressAnchor(null);
  const closePhoneMenu = () => setPhoneAnchor(null);

  const openGoogleMaps = () =>
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, "_blank");
  const openAppleMaps = () =>
    window.open(`http://maps.apple.com/?q=${encodeURIComponent(address)}`, "_blank");

  const copyAddress = () => navigator.clipboard.writeText(address);
  const callNumber = () => (window.location.href = `tel:${phone}`);
  const textNumber = () => (window.location.href = `sms:${phone}`);
  const copyNumber = () => navigator.clipboard.writeText(phone);

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "16px 20px",
  borderRadius: "24px",
  marginBottom: "16px",
  background: "#1b5e20", // ← correct mint tint
  backdropFilter: "blur(4px)",
  color: "#ffffff", // ← visible bright white
  fontSize: "1rem",
  fontWeight: 500,
  cursor: "pointer",
  boxShadow:
    "inset 0 1px 2px rgba(255,255,255,0.20), 0 2px 6px rgba(0,0,0,0.08)", // ← soft realistic depth
};


  return (
    <Box sx={{ p: 2  , backgroundColor: "#fffbf0"}}>

      {/* Address */}
      <Box sx={rowStyle} onClick={openAddressMenu}>
        <PlaceIcon sx={{ fontSize: 24, color: "#75d72c" }} />
        {address}
      </Box>

      {/* Address Menu */}
      <Menu
        anchorEl={addressAnchor}
        open={Boolean(addressAnchor)}
        onClose={closeAddressMenu}
        PaperProps={{
          elevation: 3,
          component: Paper,
          sx: {
            borderRadius: "16px",
            minWidth: "220px",
            paddingY: "4px",
          }
        }}
      >
        <MenuItem onClick={openGoogleMaps}>
          <ListItemIcon><OpenInNewIcon /></ListItemIcon>
          <ListItemText primary="Open in Google Maps" />
        </MenuItem>
        <MenuItem onClick={openAppleMaps}>
          <ListItemIcon><OpenInNewIcon /></ListItemIcon>
          <ListItemText primary="Open in Apple Maps" />
        </MenuItem>
        <MenuItem onClick={copyAddress}>
          <ListItemIcon><ContentCopyIcon /></ListItemIcon>
          <ListItemText primary="Copy Address" />
        </MenuItem>
      </Menu>

      {/* Phone */}
      <Box sx={rowStyle} onClick={openPhoneMenu}>
        <PhoneIcon sx={{ fontSize: 24, color: "#75d72c" }} />
        {phone}
      </Box>

      {/* Phone Menu */}
      <Menu
        anchorEl={phoneAnchor}
        open={Boolean(phoneAnchor)}
        onClose={closePhoneMenu}
        PaperProps={{
          elevation: 3,
          component: Paper,
          sx: {
            borderRadius: "16px",
            minWidth: "220px",
            paddingY: "4px",
          }
        }}
      >
        <MenuItem onClick={callNumber}>
          <ListItemIcon><PhoneIcon /></ListItemIcon>
          <ListItemText primary="Call" />
        </MenuItem>
        <MenuItem onClick={textNumber}>
          <ListItemIcon><TextsmsIcon /></ListItemIcon>
          <ListItemText primary="Send Text" />
        </MenuItem>
        <MenuItem onClick={copyNumber}>
          <ListItemIcon><ContentCopyIcon /></ListItemIcon>
          <ListItemText primary="Copy Number" />
        </MenuItem>
      </Menu>

    </Box>
  );
}
