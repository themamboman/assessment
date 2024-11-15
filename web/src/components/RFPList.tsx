/*
  RFPList 

  This is the main listing page that shows up upon entry.
  It will build rows based upon the entries returned from the server
*/
import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

interface RFP {
  id: string;
  carrier_name: string;
  employee_count: number;
  date_submitted: string;
  misc_data: any;
}

const RFPList: React.FC = () => {
  // state handling
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRFP, setSelectedRFP] = useState<RFP | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  // on load, pull the list of RFPs from the server
  useEffect(() => {
    fetchRFPs();
  }, []);

  // function to call the API endpoint for a full list of RFPs
  const fetchRFPs = async () => {
    const response = await axios.get("http://localhost:8080/rfps");
    setRfps(response.data);
  };

  // function to call the delete RFP endpoint
  const deleteRFP = async (id: string) => {
    await axios.delete(`http://localhost:8080/rfps/${id}`);
    setToastOpen(true);
    fetchRFPs();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        RFP List
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/add">
        Add New RFP
      </Button>
      <List>
        {rfps.map((rfp) => (
          <ListItem key={rfp.id}>
            <ListItemText
              primary={rfp.carrier_name}
              secondary={`Employee Count: ${rfp.employee_count}, Date Submitted: ${new Date(
                rfp.date_submitted
              ).toLocaleDateString("en-US")}`}
            />
            <ListItemSecondaryAction>
              <Button component={Link} to={`/details/${rfp.id}`} color="primary">
                Details
              </Button>
              <Button component={Link} to={`/edit/${rfp.id}`} color="secondary">
                Edit
              </Button>
              <Button
                onClick={() => {
                  setDeleteModalOpen(true);
                  setSelectedRFP(rfp);
                }}
                color="error"
              >
                Delete
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
      >
        <Alert severity="success" onClose={() => setToastOpen(false)}>
          {selectedRFP?.carrier_name} deleted successfully!
        </Alert>
      </Snackbar>
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedRFP?.carrier_name}? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteModalOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteRFP(selectedRFP!.id);
              setDeleteModalOpen(false);
            }}
            color="error"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RFPList;
