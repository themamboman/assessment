const { render, screen, waitFor } = require("@testing-library/react");
const { BrowserRouter } = require("react-router-dom");
const axios = require("axios");
const RFPDetails = require("../RFPDetails").default;

jest.mock("axios");

describe("RFPDetails Component", () => {
  test("fetches and displays RFP details", async () => {
    axios.get.mockResolvedValueOnce({
      data: { id: "1", carrier_name: "Carrier A", employee_count: 100, misc_data: "Some Data" },
    });

    render(
      <BrowserRouter>
        <RFPDetails match={{ params: { id: "1" } }} />
      </BrowserRouter>
    );

    await waitFor(() => {
      // look for the new strings
      expect(screen.getByText("Carrier A")).toBeInTheDocument();
      expect(screen.getByText(/100/i)).toBeInTheDocument();
    });
  });
});
