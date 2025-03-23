import ImageEditor from "./ImageEditor";
import "../styles/UserAccountDetailsPanel.scss";
import { FaPencil } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";

export default function UserAccountDetailsPanel({user})
{

    const [editing, setEditing] = useState(null);
    let editDialog = null

    const HandleNameUpdate= async ()=>{
        if(editing!="")
            {
                user.username=editing
                setEditing(null)
                const response = await axios.post(`api/user/profile/update-username?newName=${user.username}`, {}, { withCredentials: true });
                if(response.status===200)
                {
                    window.alert(`Username changed successfully your new name is: ${user.username}`)
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
    
    if (editing!=null) {
        editDialog = <div className="editBg">
            <div className="editUsernameWindow">
            <h1>Editing <span className="titleEditUname">{user.username}</span>'s username</h1>
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
            <h2>Account datails</h2>
            <hr className="AccLine"></hr>
        <div className="DivAccDetails">
        <label>Channel name: </label>
        <div className="UserAccNameEditDiv">
        <p className="AccInfo">{user.username}</p>
        <button className="editUnsernameBtn" onClick={()=>setEditing(user.username)}><FaPencil className="m-1"/></button>
        </div>
        </div>
        <div className="DivAccDetails">
        <label>Email address: </label>
        <p className="AccInfo">{user.email}</p>
        </div>
        <div className="DivAccDetails">
        <label>Created at: </label>
        <p className="AccInfo">{user.created}</p>
        </div>
        <hr className="AccLine"></hr>
        <div>
        <h2>Edit your avatar</h2>
        <ImageEditor img={user.avatar}/>
        </div>
        </div>
    )
}