import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;



const Inbox = () => {
  const [emailThreads, setEmailThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [reply, setReply] = useState("");
  const [showReplyBox, setShowReplyBox] = useState({}); // Track reply visibility per thread

  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated"); // Example: Check auth token

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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

  const handleReply = async (threadId) => {

    if (!selectedThread || reply.trim() === "") return;

    const lastEmail = selectedThread[selectedThread.length - 1]; // Get the latest email safely
    if (!lastEmail || !lastEmail.sender) {
      console.error("Error: sender is null or undefined.");
      return;
    }

    console.log("threadId "+threadId);
    console.log("email threadId "+lastEmail.threadId);
    console.log("email id "+lastEmail.id);

    const payload = {
      sender: sessionStorage.getItem("username"),
      body: reply,
      subject: lastEmail.subject,
      recipient: lastEmail.sender,
      readCheck: false,
      threadId: lastEmail.threadId, // Include threadId for proper grouping
      inReplyTo: lastEmail.id,
    };

    try {
      await axios.post(`${apiUrl}/chess-user/user/email/send`, payload);
      alert(`Reply sent to ${lastEmail.sender}`);
      setReply(""); // Clear reply field

      // Hide reply box after sending for this thread
      setShowReplyBox({ ...showReplyBox, [threadId]: false });

      fetchEmails(); // Refresh inbox after sending reply
    } catch (error) {
      console.error("Error sending reply:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", border: "solid" }}>
      {/* Sidebar - Email Threads List */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", overflowY: "auto" }}>
        <h2>Inbox</h2>
        {emailThreads.map((thread, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedThread(thread);
              setShowReplyBox({ ...showReplyBox, [thread[0].threadId]: true }); // Show reply box for this thread
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
            <p><strong>Conversation:</strong></p>

            {/* Display all emails in the thread (oldest to newest) */}
            {selectedThread
              .sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime))
              .map((email) => (
                <div key={email.id} style={{ marginBottom: "10px", padding: "10px", borderBottom: "1px solid #ccc" }}>
                  <p><strong>{email.sender}:</strong> {email.body}</p>
                  <p style={{ fontSize: "12px", color: "gray" }}>{new Date(email.createdTime).toLocaleString()}</p>
                </div>
              ))}

            {/* Reply Section (Hidden after sending reply) */}
            {showReplyBox[selectedThread[0].threadId] && (
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
                  onClick={() => handleReply(selectedThread[0].threadId)}
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
