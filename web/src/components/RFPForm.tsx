/*
  RFPForm

  This is the main entry for adding a new RFP or editing an Existing one
  It will normally go to Create New mode unless an ID of an existing one is 
  passed in on the URL line as a parameter.

  NOTE: Edit mode will enable the DELETE button
*/
import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const RFPForm: React.FC = () => {
  // state handling
  const [carrierName, setCarrierName] = useState("");
  const [employeeCount, setEmployeeCount] = useState(0);
  const [miscData, setMiscData] = useState<any>("");
  const [dateSubmitted, setDateSubmitted] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();     // if there is an ID, then user is editing existing record

  useEffect(() => {
    if (id) {
      fetchRFPDetails(id);
    }
  }, [id]);

  // if Editing, pull the details of the RFP from the server
  const fetchRFPDetails = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/rfps/${id}`);
      const { carrier_name, employee_count, misc_data, date_submitted } = response.data;
      setCarrierName(carrier_name);
      setEmployeeCount(employee_count);
      setMiscData(misc_data);
      setDateSubmitted(date_submitted);
    } catch (error) {
      console.error("Failed to fetch RFP details:", error);
    }
  };

  // submit data for new or updated RFP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // don't allow an entry without a Carrier name
    if (carrierName.trim() === "") {
      setError("Carrier Name is required.");
      return;
    }
    // don't allow an entry without a positive number of employees
    if (employeeCount < 0) {
      setError("Employee count must be 0 or above.");
      setEmployeeCount(0);
      return;
    }

    try {
      const payload = {
        carrier_name: carrierName,
        employee_count: employeeCount,
        misc_data: miscData,
        date_submitted: dateSubmitted || new Date().toISOString(),
      };

      // call the Endpoint based upon if it is adding a new one (POST) or updating existing (PUT)
      if (id) {
        await axios.put(`http://localhost:8080/rfps/${id}`, payload);
      } else {
        await axios.post("http://localhost:8080/rfps", payload);
      }

      setSuccess(true);   // set the notification toast (snackbar in Material UI) to true
      setTimeout(() => navigate("/"), 2000);  // let ther user see it bedfore returning the list scren
    } catch (error) {
      console.error("Failed to save RFP:", error);
      setError("Failed to save RFP. Please try again."); // show failure toast/snackbar
    }
  };

  // function to delete an RFP
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/rfps/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete RFP:", error);
      setError("Failed to delete RFP. Please try again.");
    } finally {
      setDeleteModalOpen(false); // hide the delete modal
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {id ? "Edit RFP" : "Add RFP"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Carrier Name"
          value={carrierName}
          onChange={(e) => setCarrierName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Employee Count"
          value={employeeCount}
          onChange={(e) => setEmployeeCount(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
          type="number"
          inputProps={{ min: "0" }}
        />
        <TextField
          label="Misc Data"
          value={miscData}
          onChange={(e) => setMiscData(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date Submitted"
          type="date"
          value={dateSubmitted}
          onChange={(e) => setDateSubmitted(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Grid container spacing={1}>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </Grid>
          {id && (
            <Grid item>
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteModalOpen(true)}
              >
                Delete
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
          <Alert severity="success" onClose={() => setSuccess(false)}>
            RFP saved successfully!
          </Alert>
        </Snackbar>
      )}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle id="delete-confirmation-dialog">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this RFP? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RFPForm;
