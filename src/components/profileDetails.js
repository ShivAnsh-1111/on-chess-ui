import React, { useState } from "react";
import axios from 'axios';

const apiUrl = process.env.SERVICE_BASE_URL;

var count = true;
const ProfileDetails = () => {
  // Mock data for user profile

  const userProfile=async()=> {
    
    var uid = sessionStorage.getItem("uid");
    try{
    const url = apiUrl+"/chess-user/user/profile/"+uid;
    const response = await axios.get(url);
    console.log(response.data);
    sessionStorage.setItem("name",response.data.user.username);
    sessionStorage.setItem("phone",response.data.profile.phoneNo);
    sessionStorage.setItem("country",response.data.profile.country);
    sessionStorage.setItem("city",response.data.profile.city+","+response.data.profile.state);
    sessionStorage.setItem("bio",response.data.profile.bio);
    
    } catch(error){
      console.error('Error:', error.response ? error.response.data : error.message);
    }

    const getProfile = {
      name: sessionStorage.getItem("name"),
      country: sessionStorage.getItem("country"),
      phone: sessionStorage.getItem("phone"),
      city: sessionStorage.getItem("city"),
      bio: sessionStorage.getItem("bio"),
    }

    setProfile(getProfile);
    setEditProfile(getProfile);
    setIsEditing(false);
  };

  if(count){
    userProfile();
    count = !count;
  }

  const initialProfile = {
    name: sessionStorage.getItem("name"),
    country: sessionStorage.getItem("country"),
    phone: sessionStorage.getItem("phone"),
    city: sessionStorage.getItem("city"),
    bio: sessionStorage.getItem("bio"),
  }


  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(initialProfile);

  const saveUserProfile=async()=> {

    const url = apiUrl+'/chess-user/user/profile/save';

    const payload = {
        name :editProfile.name,
        country : editProfile.country,
        phoneNo : editProfile.phone,
        city : editProfile.city,
        bio : editProfile.bio,
        uid : sessionStorage.getItem("uid"),
    }

    console.log('payload:',payload);
    try {
        const response = await axios.post(url, payload);

        // Handle success
        console.log('response:',response);
    } catch (error) {
        // Handle error
        console.error('Error:', error.response ? error.response.data : error.message);
        alert(`Error: ${error.response?.data.message || error.message}`);
    }

  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfile(editProfile);
    saveUserProfile();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h1 style={{ textAlign: "center" }}>Profile Details</h1>

      {isEditing ? (
        <div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Name:</strong>
            </label>
            <input
              type="text"
              name="name"
              value={editProfile.name}
              onChange={handleEditChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Phone:</strong>
            </label>
            <input
              type="text"
              name="phone"
              value={editProfile.phone}
              onChange={handleEditChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Address:</strong>
            </label>
            <input
              type="text"
              name="city"
              value={editProfile.city}
              onChange={handleEditChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Country:</strong>
            </label>
            <input
              type="text"
              name="country"
              value={editProfile.country}
              onChange={handleEditChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Bio:</strong>
            </label>
            <textarea
              name="bio"
              value={editProfile.bio}
              onChange={handleEditChange}
              rows="4"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={userProfile}
            style={{
              padding: "10px 20px",
              backgroundColor: "#d42793",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Get Profile
          </button>
        </div>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          
          <p>
            <strong>Phone:</strong> {profile.phone}
          </p>
          <p>
            <strong>Address:</strong> {profile.city}
          </p>
          <p>
            <strong>Country:</strong> {profile.country}
          </p>
          <p>
            <strong>Bio:</strong> {profile.bio}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Edit Profile
          </button>
          
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
