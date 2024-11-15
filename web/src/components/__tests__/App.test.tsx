const { render, screen, waitFor } = require("@testing-library/react");
const { BrowserRouter } = require("react-router-dom");
const App = require("../App").default;

describe("App Component", () => {
  test("renders RFPList page as default", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Check if the default page is rendered
    await waitFor(() => {
      // look for the RFP List Text
      expect(screen.getByText(/RFP List/i)).toBeInTheDocument();
    });
  });

  test("navigates to the Add RFP page", async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // look for the Button for making a new RFP and click it
    const addButton = screen.getByText(/Add New RFP/i);
    addButton.click();

    await waitFor(() => {
      // look for the new screen title
      expect(screen.getByText(/Add New RFP/i)).toBeInTheDocument();
    });
  });

  test("navigates to RFPDetails page with mock ID", async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Mock navigation to the details page
    const detailLink = container.querySelector('a[href="/details/mock-id"]');
    if (detailLink) detailLink.click();

    await waitFor(() => {
      expect(screen.getByText(/RFP Details/i)).toBeInTheDocument();
    });
  });

  test("renders 404 page for an unknown route", async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Mock navigation to a non-existent route
    window.history.pushState({}, "Test Page", "/non-existent-route");

    await waitFor(() => {
      // expect a 404 not found
      expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
    });
  });
});
