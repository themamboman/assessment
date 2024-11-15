/*
	This is a Golang mini-server, presenting basic endpoints to Create, List, Update, and Delete
	a set of RFP entries to demonstrate how to handle these functions.

	This was written as part of an assessement test by David Gentry
*/

package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	_ "modernc.org/sqlite"
)

// Define the RFP struct
type RFP struct {
	ID            uuid.UUID   `json:"id"`
	CarrierName   string      `json:"carrier_name"`
	DateSubmitted time.Time   `json:"date_submitted"`
	EmployeeCount int         `json:"employee_count"`
	MiscData      interface{} `json:"misc_data"`
}

// declare a db object
var db *sql.DB

// Initialize the database and create the RFPs table if it doesn't exist
func initDB() {
	var err error
	db, err = sql.Open("sqlite", "./sqlite.db")
	if err != nil {
		log.Fatal(err)
	}
	/*
		// remove this ... prebuilt the structure manually, this shows the DB Table layout
		createTableQuery := `
		CREATE TABLE IF NOT EXISTS rfps (
			id TEXT PRIMARY KEY,
			carrier_name TEXT,
			date_submitted DATETIME,
			employee_count INTEGER,
			misc_data TEXT
		);`

		_, err = db.Exec(createTableQuery)
		if err != nil {
			log.Fatal(err)
		}
	*/
}

// debugging function
func showCount() error {
	rowCount := 0
	// Query to get the row count
	query := "SELECT COUNT(*) FROM rfps;"
	err := db.QueryRow(query).Scan(&rowCount)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Row count for table rfps: %d\n", rowCount)
	return nil
}

// Handler to create a new RFP entry
// r = original request from web / curl
// h = response to requester
func createRFP(w http.ResponseWriter, r *http.Request) {
	var rfp RFP
	// extract the entry from the body data  of the endpoint call
	fmt.Printf("body = %v", r.Body) // debugging
	if err := json.NewDecoder(r.Body).Decode(&rfp); err != nil {
		http.Error(w, "Invalid request body payload", http.StatusBadRequest)
		return
	}

	rfp.ID = uuid.New()            // Generate a new UUID for the RFP
	rfp.DateSubmitted = time.Now() // keeping it easy for now

	miscData, err := json.Marshal(rfp.MiscData) // Serialize MiscData to JSON (free form data handling)
	if err != nil {
		http.Error(w, "Error encoding misc data", http.StatusInternalServerError)
		return
	}

	// Insert the new RFP entry into the database - old-fashioned SQL calls
	query := `INSERT INTO rfps (id, carrier_name, date_submitted, employee_count, misc_data) VALUES (?, ?, ?, ?, ?)`
	_, err = db.Exec(query, rfp.ID.String(), rfp.CarrierName, rfp.DateSubmitted, rfp.EmployeeCount, string(miscData))
	if err != nil {
		http.Error(w, "Error creating RFP", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(rfp) // respond with the record
}

// Handler to list all RFP entries
func listRFPs(w http.ResponseWriter, r *http.Request) {
	fmt.Println("listRfps")

	rows, err := db.Query("SELECT * FROM rfps")
	if err != nil {
		http.Error(w, "Error fetching RFPs", http.StatusInternalServerError)
		return
	}
	defer rows.Close() // close the db query after this function exits

	var rfps []RFP
	for rows.Next() { // loop through the array of rows returned
		fmt.Println("row")
		var rfp RFP
		var miscData string
		if err := rows.Scan(&rfp.ID, &rfp.CarrierName, &rfp.DateSubmitted, &rfp.EmployeeCount, &miscData); err != nil { // desconstruct into our object
			http.Error(w, "Error scanning RFP", http.StatusInternalServerError)
			return
		}

		json.Unmarshal([]byte(miscData), &rfp.MiscData) // Deserialize MiscData
		rfps = append(rfps, rfp)                        // add to the array
	}
	fmt.Printf("row count = %d", len(rfps))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rfps)
}

// Handler to retrieve a single RFP by ID
func getRFP(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	var rfp RFP
	var miscData string
	// build the query and executie it
	query := "SELECT id, carrier_name, date_submitted, employee_count, misc_data FROM rfps WHERE id = ?"
	err := db.QueryRow(query, id).Scan(&rfp.ID, &rfp.CarrierName, &rfp.DateSubmitted, &rfp.EmployeeCount, &miscData)
	if err == sql.ErrNoRows {
		http.Error(w, "RFP not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Error fetching RFP", http.StatusInternalServerError)
		return
	}

	json.Unmarshal([]byte(miscData), &rfp.MiscData) // Deserialize MiscData
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rfp)
}

// Handler to update an RFP entry
func updateRFP(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	// extract the input payload
	var rfp RFP
	if err := json.NewDecoder(r.Body).Decode(&rfp); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	rfp.ID, _ = uuid.Parse(id)                  // Use the provided ID
	miscData, err := json.Marshal(rfp.MiscData) // Serialize MiscData to JSON
	if err != nil {
		http.Error(w, "Error encoding misc data", http.StatusInternalServerError)
		return
	}

	// do an update call with the data to change
	query := `UPDATE rfps SET carrier_name = ?, date_submitted = ?, employee_count = ?, misc_data = ? WHERE id = ?`
	_, err = db.Exec(query, rfp.CarrierName, rfp.DateSubmitted, rfp.EmployeeCount, string(miscData), id)
	if err != nil {
		http.Error(w, "Error updating RFP", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rfp)
}

// Handler to delete an RFP entry by ID
func deleteRFP(w http.ResponseWriter, r *http.Request) {
	// get the id of the RFP to delete
	params := mux.Vars(r)
	id := params["id"]

	// execute the call to delete the one with the matching ID
	_, err := db.Exec("DELETE FROM rfps WHERE id = ?", id)
	if err != nil {
		http.Error(w, "Error deleting RFP", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func main() {
	// Initialize the database
	initDB()
	showCount() //quicly show the number of rows for this DB table on startup

	// Set up the router
	r := mux.NewRouter()

	// Define the API endpoints
	r.HandleFunc("/rfps", createRFP).Methods("POST")
	r.HandleFunc("/rfps", listRFPs).Methods("GET")
	r.HandleFunc("/rfps/{id}", getRFP).Methods("GET")
	r.HandleFunc("/rfps/{id}", updateRFP).Methods("PUT")
	r.HandleFunc("/rfps/{id}", deleteRFP).Methods("DELETE")

	// handle CORS so we can test locally
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // React app's URL when running locally.  Best not to use "*"
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Wrap the router with the CORS handler
	handler := corsHandler.Handler(r)

	// Start the server
	fmt.Println("Server is running on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
