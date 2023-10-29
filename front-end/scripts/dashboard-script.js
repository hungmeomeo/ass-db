function toggleSection(section) {
    section.querySelector('.section-content').style.display =
        section.querySelector('.section-content').style.display === 'none' ? 'block' : 'none';
    section.querySelector('#executeButton').style.display =
        section.querySelector('#executeButton').style.display === 'none' ? 'block' : 'none';    
}

// Add click event listeners to section headers
const sectionHeaders = document.querySelectorAll('.section-header');
sectionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        toggleSection(header.parentElement);
    });
});

document.getElementById("executeButton").addEventListener("click", function() {
    const query = document.getElementById("query").value;

    // Send the query to the server-side API for execution
    // You'd need to implement the server-side API for executing the query

    // For this example, let's assume we get a JSON response from the API
    const apiResponse = {
        result: "Your query result goes here."
    };

    document.getElementById("queryResult").textContent = JSON.stringify(apiResponse, null, 2);
    document.getElementById("result").style.display = "block";
});