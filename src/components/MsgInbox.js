import React, { useState, useEffect } from "react";
import axios from 'axios';

var count = true;
// Mock data for emails
var mockEmails = [];

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const userEmails=async()=> {
    
    var username = sessionStorage.getItem("username");
    try{
    const url = "http://13.233.104.133:8888/chess-user/user/email/get/"+username;
    console.log(url);
    const response = await axios.get(url);
    console.log(response.data);
    
    mockEmails = response.data;
    } catch(error){
      console.error('Error:', error.response ? error.response.data : error.message);
    }
    setEmails(mockEmails);
  };

  useEffect(() => {
    // Simulating a fetch request
    setEmails(mockEmails);
  }, []);

  const markAsRead = (id) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, read: true } : email
      )
    );
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    markAsRead(email.id);
    setIsReplying(false); // Close reply editor if switching emails
    setReply(""); // Clear the reply text area
  };

  const handleReply = async() => {
    console.log("Reply sent:", reply);
    alert(`Reply sent to ${selectedEmail.sender}: ${reply}`);

    try{
      const url = "http://13.233.104.133:8888/chess-user/user/email/send"
      const payload = {
        sender: sessionStorage.getItem("username"),
        body: reply,
        subject: selectedEmail.subject,
        recipient: selectedEmail.sender,
        readCheck: false,
      }
      console.log(payload);
      console.log(url);
      const response = await axios.post(url,payload);
      console.log(response.data);
      
      } catch(error){
        console.error('Error:', error.response ? error.response.data : error.message);
      }

    setReply("");
    setIsReplying(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh" ,border: "solid"}}>
      {/* Sidebar */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", overflowY: "auto" }}>
        <h2>Inbox</h2>
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => handleEmailClick(email)}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: email.read ? "#f9f9f9" : "#e8f5e9",
              borderBottom: "1px solid #ccc",
            }}
          >
            <strong>{email.sender}</strong>
            <p>{email.subject}</p>
          </div>
        ))}
      </div>
      <div>
      <button
              onClick={userEmails}
              style={{
                padding: "5px 10px",
                backgroundColor: "#B600FF",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Get Mails
            </button>
      </div>

      {/* Email Details */}
      <div style={{ flex: 2, padding: "20px" }}>
        {selectedEmail ? (
          <>
            <h2>{selectedEmail.subject}</h2>
            <p>
              <strong>From:</strong> {selectedEmail.sender}
            </p>
            <p>{selectedEmail.body}</p>

            {/* Reply Button */}
            <button
              onClick={() => setIsReplying((prev) => !prev)}
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
              {isReplying ? "Cancel Reply" : "Reply"}
            </button>

            {/* Reply Text Area */}
            {isReplying && (
              <div style={{ marginTop: "20px" }}>
                <textarea
                  rows="4"
                  cols="50"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply here..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
                <button
                  onClick={handleReply}
                  style={{
                    marginTop: "10px",
                    padding: "10px 15px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  disabled={!reply.trim()}
                >
                  Send Reply
                </button>
              </div>
            )}
          </>
        ) : (
          <p>Select an email to view details</p>
        )}
      </div>
    </div>
    
  );
};

export default Inbox;
