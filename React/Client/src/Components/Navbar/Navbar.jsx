import "./Navbar.css";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import UserContext from "../context/UserProvider.jsx";





const Navbar = ({ user }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
 

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    logoutUser();
    try {
      const response = await axios.post("http://localhost:3000/users/logout");
      navigate("/login")
      const { message } = response.data;
      toast.success(message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  

  return (
    <AppBar position="static" sx={{marginBottom:"0.5rem", backgroundColor:"#107345dc"}}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
          <i class="fa-solid fa-comments-dollar" style={{fontSize:"1.5rem"}}></i>
            <Typography
              variant="h5"
              noWrap
              sx={{
                ml: 2,
                mr: 3,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              ChatApp
            </Typography>
          </div>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                onClick={handleCloseUserMenu}
                sx={{ display: user ? "none" : "block" }}
              >
                <Typography
                  sx={{ textDecoration: "none", color: "black" }}
                  textAlign="center"
                  to="/login"
                  component={Link}
                >
                  {" "}
                  Sign In
                </Typography>
              </MenuItem>

              <MenuItem
                onClick={handleLogout}
                sx={{ display: user ? "block" : "none" }}
              >
                <Typography
                  sx={{ textDecoration: "none", color: "black" }}
                  textAlign="center"
                  to="/index"
                  component={Link}
                >
                  Log Out
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
