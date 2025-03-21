import ImageEditor from "./ImageEditor";
import "../styles/UserAccountDetailsPanel.scss";
import { FaPencil } from "react-icons/fa6";
import { useState } from "react";

export default function UserAccountDetailsPanel({user})
{

    const [editing, setEditing] = useState(null);
    let editDialog = null
    
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
            <button onClick={() => {
                if(editing!="")
                {
                    user.username=editing
                    setEditing(null)
                }
                else
                {
                    window.alert("Type in new username!")
                }        
            }} className="editUsernameSave">Save</button>
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