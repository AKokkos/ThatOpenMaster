// Select elements for error pop-up control
const errorPopup = document.getElementById("errorPopup") as HTMLElement;
const closeErrorPopupBtn = document.getElementById("closeErrorPopup") as HTMLElement;
const errorMessageElement = document.getElementById("errorMessage") as HTMLElement;

// Function to show the error pop-up with a dynamic message
export function showErrorPopup(message: string) {
  if (errorMessageElement) {
    errorMessageElement.textContent = message;  // Set the error message
  }
  errorPopup.classList.remove("hidden");  // Show the pop-up
}

// Function to hide the error pop-up
function hideErrorPopup() {
  errorPopup.classList.add("hidden");
}

// Close the error pop-up when clicking the close button
closeErrorPopupBtn.addEventListener("click", hideErrorPopup);

// Close the error pop-up if clicked outside the content area
errorPopup.addEventListener("click", (event) => {
  if (event.target === errorPopup) {
    hideErrorPopup();
  }
});