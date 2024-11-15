const { render, screen, fireEvent, waitFor } = require("@testing-library/react");
const { BrowserRouter } = require("react-router-dom");
const axios = require("axios");
const RFPForm = require("../RFPForm").default;

jest.mock("axios");

describe("RFPForm Component", () => {
  test("renders the form and submits data", async () => {
    axios.post.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <RFPForm />
      </BrowserRouter>
    );

    const carrierNameInput = screen.getByLabelText(/Carrier Name/i);
    const employeeCountInput = screen.getByLabelText(/Employee Count/i);
    const submitButton = screen.getByText(/Submit/i);

    fireEvent.change(carrierNameInput, { target: { value: "Carrier X" } });
    fireEvent.change(employeeCountInput, { target: { value: "300" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      // verify tha ta call was made to send the data specified
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8080/rfps", {
        carrier_name: "Carrier X",
        employee_count: 300,
        misc_data: null,
      });
    });
  });
});
