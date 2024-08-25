import { Grid, Paper, TextField, Typography, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import {useNavigate,Link} from "react-router-dom";
import {toast} from "react-toastify";

const Signup = () => {
  const paperStyle = {
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "1rem",
    boxShadow: " 4px 7px 8px",
  };

  const row = { display: "flex", marginTop: "0.75rem" };
  const navigate = useNavigate();

  let [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  let handleInputChange = (event) => {
    let fieldname = event.target.name;
    let newVal = event.target.value;

    setFormData((currData) => {
      currData[fieldname] = newVal;
      return { ...currData };
    });
  };

  let handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post("http://localhost:3000/users/signup",formData)
    const {message,success} = response.data;
    console.log(response);
    if(success){
      toast.success(message);
      navigate("/chat");
    } else {
      toast.error(message);
      navigate("/signup");
    }
    
    setFormData({
      username: "",
      email :"",
      password :""
    });
  };

  return (
    <Grid
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Paper
        style={paperStyle}
        sx={{
          width: {
            xs: "85vw",
            sm: "50vw",
            lg: "30vw",
            xl: "23vw",
          },
          height: "60vh",
          mt: 8,
        }}
      >
        <Typography sx={{ fontWeight: "550", fontSize: "2rem" }}>
          Signup{" "}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            style={row}
            type="text"
            label="Enter UserName"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          ></TextField>
          <TextField
            style={row}
            type="email"
            label="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          ></TextField>
          <TextField
            style={row}
            type="password"
            label="Enter Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          ></TextField>
          <Button
            sx={{ mt: 3, width: "100%", p: 1.25 }}
            variant="contained"
            color="success"
            type="submit"
          >
            Submit
          </Button>
          <Typography sx={{ fontWeight: "500", fontSize: "0.95rem", pt:2}}>
            Already have an account?  <Link to="/login">Sign In</Link> 
          </Typography>
        </form>
      </Paper>
    </Grid>
  );
};

export default Signup;
