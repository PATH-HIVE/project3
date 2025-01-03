console.log('the javascript is working')
document.getElementById("addParticipant").addEventListener("click", () => {
    const participantsDiv = document.getElementById("participants");
    const newParticipant = document.createElement("div");
    newParticipant.className = "participant";
    newParticipant.innerHTML = `
      <label>Name:</label>
      <input type="text" placeholder="Participant's Name" class="participantName" required>
      <label>Email:</label>
      <input type="email" placeholder="Participant's Email" class="participantEmail" required>
    `;
    participantsDiv.appendChild(newParticipant);
     // Scroll to the top of the page when the "Add Participant" button is clicked
     window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  document.getElementById("meetingForm").addEventListener("submit", (event) => {
    event.preventDefault();
  
    // Collect meeting details
    const purpose = document.getElementById("purpose").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
  
    // Collect participants
    const participantNames = document.querySelectorAll(".participantName");
    const participantEmails = document.querySelectorAll(".participantEmail");
  
    const participants = [];
    for (let i = 0; i < participantNames.length; i++) {
      participants.push({
        name: participantNames[i].value,
        email: participantEmails[i].value,
      });
    }
  
    // Save data in sessionStorage
    const meetingData = {
      purpose,
      location,
      date,
      time,
      participants,
    };
  
    sessionStorage.setItem("meetingData", JSON.stringify(meetingData));
  
    // Redirect to dueDiligence.html
    window.location.href = "dueDiligence.html";
  });

  window.addEventListener("load", function () {
    const storedData = JSON.parse(sessionStorage.getItem("meetingData"));
    if (storedData) {
      console.log("Retrieved Data from sessionStorage:", storedData);

      // Display the data on the page
      const displayDiv = document.createElement("div");
      displayDiv.innerHTML = `
        <h2>Meeting Details</h2>
        <p><strong>Purpose:</strong> ${storedData.purpose}</p>
        <p><strong>Location:</strong> ${storedData.location}</p>
        <p><strong>Date:</strong> ${storedData.date}</p>
        <p><strong>Time:</strong> ${storedData.time}</p>
        <h3>Participants</h3>
        <ul>
          ${storedData.participants
            .map(
              (participant) =>
                `<li><strong>Name:</strong> ${participant.name}, <strong>Email:</strong> ${participant.email}</li>`
            )
            .join("")}
        </ul>
      `;
      document.body.appendChild(displayDiv);

      // Generate PDF Logic
      const generatePdfButton = document.getElementById("generate-pdf");
      generatePdfButton.addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add content to the PDF
        doc.text("Meeting Details", 10, 10);
        doc.text(`Purpose: ${storedData.purpose}`, 10, 20);
        doc.text(`Location: ${storedData.location}`, 10, 30);
        doc.text(`Date: ${storedData.date}`, 10, 40);
        doc.text(`Time: ${storedData.time}`, 10, 50);

        doc.text("Participants:", 10, 60);
        storedData.participants.forEach((participant, index) => {
          doc.text(
            `${index + 1}. Name: ${participant.name}, Email: ${participant.email}`,
            10,
            70 + index * 10
          );
        });

        // Save the PDF
        doc.save("MeetingDetails.pdf");
      });
    } else {
      console.log("No meeting data found in sessionStorage!");
    }
  });