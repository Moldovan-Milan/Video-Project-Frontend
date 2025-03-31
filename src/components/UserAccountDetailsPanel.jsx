import ImageEditor from "./ImageEditor";
import "../styles/UserAccountDetailsPanel.scss";
import { FaPencil } from "react-icons/fa6";
import { useContext, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { UserContext } from "./contexts/UserProvider";
import { useNavigate } from "react-router-dom";


export default function UserAccountDetailsPanel({userData})
{
    const [editing, setEditing] = useState(null);
    let editDialog = null
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    const HandleNameUpdate= async ()=>{
        if(editing!="")
            {
                userData.username=editing
                setEditing(null)
                let URL = `api/user/profile/update-username?newName=${userData.username}`
                if(user.roles.includes("Admin") && user.id!=userData.id){
                    URL = `api/Admin/edit-user/${userData.id}?username=${userData.username}`
                }

                const response = await axios.post(URL, {}, { withCredentials: true });
                if(response.status===200)
                {
                    window.alert(`Username changed successfully the new name is: ${userData.username}`)
                    location.reload();
                }
                else if(response.status === 204){
                    window.alert("You succesfully changed this user's name!")
                    location.reload();
                }
                else
                {
                    window.alert("Username change is unsuccessful!")
                }
                
            }
            else
            {
                window.alert("Type in a new username!")
            }        
        
    }

    const handleDelete = async () => {
        const confirmation = window.confirm(
            "Warning: Deleting your account is permanent! All your videos, comments, and data will be erased forever. This action CANNOT be undone."
        );
    
        if (!confirmation) return;
    
        try {
            let URL = `/api/User/profile/delete-account`
            if(user.roles.includes("Admin") && user.id!=userData.id){
                URL = `/api/Admin/delete-user/${userData.id}`
            }
            const response = await axios.delete(URL, {
                withCredentials: true,
            });
    
            if (response.status === 204) {
                if(user.id === userData.id){
                    setUser(null);
                }
                window.alert("Account has been successfully deleted.");
                navigate("/");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            window.alert("An error occurred while deleting account. Please try again.");
        }
    };
    
    
    if (editing!=null) {
        editDialog = <div className="editBg">
            <div className="editUsernameWindow">
            <h1>Editing <span className="titleEditUname">{userData.username}</span>'s username</h1>
            <div>
            <label>New username: </label>
            <input value={editing} onChange={e => setEditing(prev => {
                prev = e.target.value
                return prev
            })} />
            </div>
            <div>
            <button onClick={() => HandleNameUpdate()} className="editUsernameSave">Save</button>
            <button onClick={() => setEditing(null)} className="editUsernameCancel">Cancel</button>
            </div>
        </div>
        </div>
    }

    

    return(
        
        <div className="DivDetailsPanel">
                {editDialog}
                <h2>Account details</h2>
                <hr className="AccLine"></hr>
            <div className="DivAccDetails">
            <label>Channel name: </label>
            <div className="UserAccNameEditDiv">
            <p className="AccInfo">{userData.username}</p>
            <button className="editUnsernameBtn" onClick={()=>setEditing(userData.username)}><FaPencil className="m-1"/></button>
            </div>
            </div>
            <div className="DivAccDetails">
            <label>Email address: </label>
            <p className="AccInfo">{userData.email}</p>
            </div>
            <div className="DivAccDetails">
            <label>Created at: </label>
            <p className="AccInfo">{userData.created}</p>
            </div>
            <hr className="AccLine"></hr>
            <div>
            <h2>Edit avatar</h2>
            <ImageEditor img={userData.avatar}/>
            </div>
            <button className="deleteBtn" onClick={handleDelete}>
                <FaTrash className="m-1"/> Delete account
            </button>
        </div>
    )
}