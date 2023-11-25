import React from "react";

function LogoutButton() {
  const handleLogout = async () => {
    try {
      // Send a POST request to a logout API endpoint

      // The logout was successful; remove the token from storage
      sessionStorage.removeItem("authToken");

      // Redirect to the home page after successful logout
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="">
      Logout
    </button>
  );
}

export default LogoutButton;
