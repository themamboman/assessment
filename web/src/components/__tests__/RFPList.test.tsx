const { render, screen, fireEvent, waitFor } = require("@testing-library/react");
const { BrowserRouter } = require("react-router-dom");
const axios = require("axios");
const RFPList = require("../RFPList").default;

jest.mock("axios");

describe("RFPList Component", () => {
  test("renders the list of RFPs", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: "1", carrier_name: "Carrier A", employee_count: 100, misc_data: "Data A" },
        { id: "2", carrier_name: "Carrier B", employee_count: 200, misc_data: "Data B" },
      ],
    });

    render(
      <BrowserRouter>
        <RFPList />
      </BrowserRouter>
    );

    await waitFor(() => {
      // make sure the new names are on screen
      expect(screen.getByText("Carrier A")).toBeInTheDocument();
      expect(screen.getByText("Carrier B")).toBeInTheDocument();
    });
  });

  test("handles delete functionality", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: "1", carrier_name: "Carrier A", employee_count: 100, misc_data: "Data A" }],
    });
    axios.delete.mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <RFPList />
      </BrowserRouter>
    );

    await waitFor(() => {
      // check screen for the entry we are going to try to delete
      expect(screen.getByText("Carrier A")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      // verify that a call was attempted to delete the entry
      expect(axios.delete).toHaveBeenCalledWith("http://localhost:8080/rfps/1");
    });
  });
});
