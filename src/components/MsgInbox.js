import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Inbox = () => {
  const [emailThreads, setEmailThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [reply, setReply] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(true); // State to control reply box visibility

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    const uid = sessionStorage.getItem("uid");
    try {
      const response = await axios.get(`${apiUrl}/chess-user/user/email/get/${uid}`);
      setEmailThreads(response.data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  const handleReply = async () => {
    if (!selectedThread || selectedThread.length === 0 || reply.trim() === "") return;

    const lastEmail = selectedThread[selectedThread.length - 1]; // Get the latest email safely
    if (!lastEmail || !lastEmail.sender) {
      console.error("Error: sender is null or undefined.");
      return;
    }

    const payload = {
      sender: sessionStorage.getItem("username"),
      body: reply,
      subject: lastEmail.subject,
      recipient: lastEmail.sender,
      readCheck: false,
    };

    try {
      await axios.post(`${apiUrl}/chess-user/user/email/send`, payload);
      alert(`Reply sent to ${lastEmail.sender}`);
      setReply(""); // Clear reply field
      setShowReplyBox(false); // Hide reply box after sending
    } catch (error) {
      console.error("Error sending reply:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", border: "solid" }}>
      {/* Sidebar */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", overflowY: "auto" }}>
        <h2>Inbox</h2>
        {emailThreads.map((thread, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedThread(thread);
              setShowReplyBox(true); // Show reply box when selecting a new thread
            }}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: selectedThread === thread ? "#e8f5e9" : "white",
              borderBottom: "1px solid #ccc",
            }}
          >
            <strong>{thread[0]?.subject || "No Subject"}</strong>
          </div>
        ))}
      </div>

      {/* Email Details */}
      <div style={{ flex: 2, padding: "20px" }}>
        {selectedThread ? (
          <>
            <h2>{selectedThread[0]?.subject || "No Subject"}</h2>
            <p><strong>From:</strong> {selectedThread[0]?.sender || "Unknown"}</p>

            {[...selectedThread].reverse().map((email) => (
              <div key={email.id} style={{ marginBottom: "10px", padding: "10px", borderBottom: "1px solid #ccc" }}>
                <p>{email.body}</p>
              </div>
            ))}

            {/* Reply Section (Hidden after sending reply) */}
            {showReplyBox && (
              <>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  style={{
                    width: "100%",
                    height: "80px",
                    marginTop: "10px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                ></textarea>

                <button
                  onClick={handleReply}
                  style={{
                    marginTop: "10px",
                    padding: "10px 15px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Reply
                </button>
              </>
            )}
          </>
        ) : (
          <p>Select a subject to view emails</p>
        )}
      </div>
    </div>
  );
};

export default Inbox;
