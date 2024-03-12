// Define API key and URL constants
const API_KEY = "Z4dlYCJw9sePoIH_ENROkCr-le0";
const API_URL = "https://ci-jshint.herokuapp.com/api";

// Create a modal instance using Bootstrap for displaying results
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// Add event listeners for status button and submit button
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

// Function to process options in a form
function processOptions(form) {
  let optArray = [];

  // Iterate over form entries
  for (let e of form.entries()) {
    // Check if the entry is for options
    if (e[0] === "options") {
      // Push option value to array
      optArray.push(e[1]);
    }
  }

  // Delete existing options from form
  form.delete("options");

  // Append processed options to form
  form.append("options", optArray.join());

  return form;
}

// Asynchronous function to handle form submission
async function postForm(e) {

  // Process options in the form
  const form = processOptions(new FormData(document.getElementById("checksform")));

  // Send form data to API
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": API_KEY,
    },
    body: form,
  });

  // Parse response data as JSON
  const data = await response.json();

  // If response is successful, display errors
  if (response.ok) {
    displayErrors(data);
  } else {
    // If there's an error, display exception and throw an error
    displayException(data);
    throw new Error(data.error);
  }
}

// Asynchronous function to get API status
async function getStatus(e) {

  // Construct query string for API status
  const queryString = `${API_URL}?api_key=${API_KEY}`;

  // Send request to API for status
  const response = await fetch(queryString);

  // Parse response data as JSON
  const data = await response.json();

  // If response is successful, display status
  if (response.ok) {
    displayStatus(data);
  } else {
    // If there's an error, display exception and throw an error
    displayException(data);
    throw new Error(data.error);
  }
}

// Function to display exception details
function displayException(data) {

  // Define heading for exception
  let heading = `An Exception Occurred`;

  // Construct result content
  let results = `<div>The API returned status code ${data.status_code}</div>`;
  results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
  results += `<div>Error text: <strong>${data.error}</strong></div>`;

  // Set the modal title with the heading
  document.getElementById("resultsModalTitle").innerHTML = `<div class="error-heading">${heading}</div>`;

  // Set the modal content with results
  document.getElementById("results-content").innerHTML = results;

  // Show the modal
  resultsModal.show();
}

// Function to display JSHint errors
function displayErrors(data) {

  // Initialize results
  let results = "";

  // Construct heading for JSHint results
  let heading = `JSHint Results for ${data.file}`;

  // Check if there are no errors reported
  if (data.total_errors === 0) {
    // If no errors, display a message indicating so
    results = `<div class="no_errors">No errors reported!</div>`;
  } else {
    // If errors exist, construct error details
    results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
    for (let error of data.error_list) {
      results += `<div>At line <span class="line">${error.line}</span>, `;
      results += `column <span class="column">${error.col}:</span></div>`;
      results += `<div class="error">${error.error}</div>`;
    }
  }

  // Set the modal title with the heading
  document.getElementById("resultsModalTitle").innerText = heading;

  // Set the modal content with results
  document.getElementById("results-content").innerHTML = results;

  // Show the modal
  resultsModal.show();
}

// Function to display API key status
function displayStatus(data) {

  // Define heading for API key status
  let heading = "API Key Status";

  // Construct content for API key status
  let results = `<div>Your key is valid until</div>`;
  results += `<div class="key-status">${data.expiry}</div>`;

  // Set the modal title with the heading
  document.getElementById("resultsModalTitle").innerText = heading;

  // Set the modal content with results
  document.getElementById("results-content").innerHTML = results;

  // Show the modal
  resultsModal.show();
}
