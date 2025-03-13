import React, { useState, useEffect } from "react";
import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

var count = true;
// Mock data for emails
var mockEmails = [];

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const [emailThreads, setEmailThreads] = useState([]); // Holds all email threads
  const [selectedThread, setSelectedThread] = useState(null); // Holds currently selected thread


  const userEmails=async()=> {
    
    var uid = sessionStorage.getItem("uid");
    try{
    const url = apiUrl+"/chess-user/user/email/get/"+uid;
    console.log(url);
    const response = await axios.get(url);
    console.log(response.data);

    // Flatten the list of lists into a single list
    const flattenedEmails = response.data.flat();

    mockEmails = flattenedEmails;
    } catch(error){
      console.error('Error:', error.response ? error.response.data : error.message);
    }
    setEmails(mockEmails);
  };

  useEffect(() => {
    // Simulating a fetch request
    setEmails(mockEmails);
  }, []);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    var uid = sessionStorage.getItem("uid");
    try {
      const url = apiUrl + "/chess-user/user/email/get/" + uid;
      const response = await axios.get(url);
      
      setEmailThreads(response.data); // Store email threads directly
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

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
      const url = apiUrl+"/chess-user/user/email/send"
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
        {emailThreads.map((thread, index) => (
          <div
            key={index}
            onClick={() => setSelectedThread(thread)}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: selectedThread === thread ? "#e8f5e9" : "white",
              borderBottom: "1px solid #ccc",
            }}
          >
            <strong>{thread[0].subject}</strong> {/* Show subject from the first email of the thread */}
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
        {selectedThread ? (
          <>
            {/* Show subject & sender only once at the top */}
            <h2>{selectedThread[0].subject}</h2>
            <p><strong>From:</strong> {selectedThread[0].sender}</p>

            {/* Reverse the order of messages */}
            {[...selectedThread].reverse().map((email) => (
              <div key={email.id} style={{ marginBottom: "10px", padding: "10px", borderBottom: "1px solid #ccc" }}>
                <p>{email.body}</p>
              </div>
            ))}

            {/* Reply Section */}
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
        ) : (
          <p>Select a subject to view emails</p>
        )}
      </div>
    </div>
    
  );
};

export default Inbox;
