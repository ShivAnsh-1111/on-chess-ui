import React, { useState } from 'react';
import axios from 'axios';

const OnlineUsers = () => {

  var mockMembers =[];

  const [users, setUsers] = useState([]);

  const getMembers= async()=>{
    
      try{
        const url = "http://localhost:8081/chess-user/users/online"
        
        const response = await axios.get(url);
        console.log(response.data);
        mockMembers = response.data;
        } catch(error){
          console.error('Error:', error.response ? error.response.data : error.message);
        }
        setUsers(mockMembers);
  }

  // List of online users
  
  

  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user
  const [message, setMessage] = useState(''); // Message input
  const [subject, setSubject] = useState('');
  const [sentMessages, setSentMessages] = useState([]); // Track sent messages

  // Handle selecting a user to reply to
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessage('');
  };

  // Handle sending a reply
  const handleSendReply = () => {
    if (!message.trim()) return alert('Message cannot be empty!');

    setSentMessages((prev) => [
      ...prev,
      { to: selectedUser.id, userName: selectedUser.username, content: message },
    ]);
    handleReply();
    setMessage('');
    setSelectedUser(null);
  };

  const handleReply = async() => {
      console.log("Reply sent to:",selectedUser.username);
      alert(`Reply sent to ${selectedUser.username}: ${message}`);

      try{
        const url = "http://localhost:8081/chess-user/users/email/send"
        const payload = {
          sender: sessionStorage.getItem("username"),
          body: message,
          subject: subject,
          recipient: selectedUser.username,
          readCheck: false,
        }
        console.log(payload);
        console.log(url);
        const response = await axios.post(url,payload);
        console.log(response.data);
        
        } catch(error){
          console.error('Error:', error.response ? error.response.data : error.message);
        }

      
    } ;
  

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", textAlign: "center" , border: "solid"}}>
      <h2>Online Users</h2>
      <ul style={{ listStyle: "none", padding: "0" }}>
        {!selectedUser && users.map((user) => (
          <li key={user.id} 
          style={{
            margin: "10px 0",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            {user.username} {user.online ? '(Online)' : '(Offline)'}
            {user.online && ( <div>
              <button 
              style={{
                marginTop: "10px",
                padding: "10px 15px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleSelectUser(user)}>Message</button>
              </div>)}
              {<div><button 
              style={{
                marginTop: "10px",
                padding: "10px 15px",
                backgroundColor: "#4070F7",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleSelectUser(user)}>Game Request</button></div>}
          </li>
          
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h3>Talking to {selectedUser.username}</h3>
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            rows="1"
                  cols="50"
                  
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows="4"
                  cols="50"
                  
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
          />
          <br />
          <button onClick={handleSendReply}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#49CC57",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}>Send</button>
          <button onClick={() => setSelectedUser(null)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#FF0064",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}>Cancel</button>
          
        </div>
      )}

      <h3>Sent Messages</h3>
      <ul>
        {sentMessages.map((msg, index) => (
          <li key={index}>
            To {msg.userName}: {msg.content}
          </li>
        ))}
      </ul>
      <button
              onClick={getMembers}
              style={{
                padding: "5px 10px",
                backgroundColor: "#B600FF",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Get Online Users
            </button>
    </div>
  );
};

export default OnlineUsers;
