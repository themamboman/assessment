/*
  RFPDetails

  This screen shows the details of a selected RFP
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Button, Typography, Container } from "@mui/material";

interface RFP {
  id: string;
  carrier_name: string;
  employee_count: number;
  misc_data: any;
  date_submitted: string; // New date field
}

// function to make a user-friendly viewing of the date submitted field
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" }).format(date);
};

const RFPDetails: React.FC = () => {
  // state handling
  const { id } = useParams<{ id: string }>();       // ID used to get details
  const [rfp, setRfp] = useState<RFP | null>(null);

  // on loading, call the fetchRFP function
  useEffect(() => {
    fetchRFP();
  }, []);

  // call the API Endpoint to get the information about this RFP
  const fetchRFP = async () => {
    const response = await axios.get(`http://localhost:8080/rfps/${id}`);
    setRfp(response.data);  // set the state so that the screen will refresh with the data
  };

  // Show a loading text if nothing is received yet from the server
  if (!rfp) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        RFP Details
      </Typography>
      <Typography variant="body1">Carrier Name: {rfp.carrier_name}</Typography>
      <Typography variant="body1">Employee Count: {rfp.employee_count}</Typography>
      <Typography variant="body1">Misc Data: {JSON.stringify(rfp.misc_data)}</Typography>
      <Typography variant="body1">Date Submitted: {formatDate(rfp.date_submitted)}</Typography>
      <Button component={Link} to="/" variant="contained" style={{ marginRight: "5px" }}>
        Back
      </Button>
      <Button component={Link} to={`/edit/${rfp.id}`} variant="contained" color="primary">
        Edit
      </Button>
    </Container>
  );
};

export default RFPDetails;
