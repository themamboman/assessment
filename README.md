# Assessment Project for OneDigital Fullstack Developer Role

This project consists of two main pieces:  
1. **Backend Server** written in Golang, presenting multiple RESTful API endpoints.  
2. **Frontend** written in ReactJS using the Material-UI library.  

---

## Running the Golang Server  

The Golang server can be run in one of two ways:  
- **Using the Prebuilt Binary**:  
  Navigate to the `server` folder and launch the prebuilt binary from a command line prompt.  

- **Using Go Setup**:  
  Ensure Go is set up on your machine (visit [go.dev](https://go.dev)). Then:  
  1. Navigate to the `server/src` folder.  
  2. Run the following command:  
     ```bash
     go run main2.go
     ```  

Either method will open the `sqlite.db` file in the same location and start serving at:  
**http://localhost:8080**  

---

## Running the Frontend  

After starting the server, you need to start the UI web frontend:  
1. Open another terminal/command line and navigate to the `web` folder.  
2. Run the following command to install the necessary packages:  
   ```bash
   npm install
   ```  
   *(Ensure Node.js is installed on your machine – visit [nodejs.org](https://nodejs.org))*  

3. Once all packages are installed, start the app locally:  
   ```bash
   npm start
   ```  
4. This should launch the default browser, pointing to:  
   **http://localhost:3000**  

---

## Features  

### Entry Page  

The entry page lists existing RFP entries from the `sqlite.db` file. Each entry displays:  
- **Carrier Name**  
- **Employee Count**  
- **Date Submitted**  

At the top of the page, a **large primary button** labeled `ADD NEW RFP` allows users to add new entries.  

---

### Actions for Each Entry  

For each RFP entry, three actions are available:  

1. **Details**:  
   - Displays detailed information about the RFP, including the **Freeform (MiscData)** field.  
   - Includes options to **Edit** the entry or **Go Back**.  

2. **Edit**:  
   - Uses the same form as `Add New`, but also includes a **Delete** button.  

3. **Delete**:  
   - Clicking delete shows a confirmation dialog before calling the delete endpoint.  
   - A **success toast notification** appears upon successful deletion.  

---

### Add/Edit Form  

The form ensures data validation:  
- **Carrier Name** is required.  
- **Employee Count** accepts only non-negative numbers.  

---

Thank you for taking the time to review this project.  

**DG**  