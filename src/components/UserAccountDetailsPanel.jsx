import ImageEditor from "./ImageEditor";
import "../styles/UserAccountDetailsPanel.scss";
import { FaPencil } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";

export default function UserAccountDetailsPanel({user})
{

    const [editing, setEditing] = useState(null);
    const [banner,setBanner]=useState(null);
    const [bg,setBg]=useState(null);
    const [txtColor,setTxtColor]=useState(null);
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

    const HandleThemeUpload= async ()=>{
        const formData=new FormData();
        formData.append("background",bg);
        formData.append("textColor",txtColor);
        formData.append("bannerImage",banner)

        const response = await axios.post("api/user/profile/set-theme", formData, {withCredentials:true});
        if(response.status===200)
            {
                window.alert("Custom theme uploaded successfully!");
                location.reload();
                
            }
            else
                {
                    window.alert("Custom theme uploaded is unsuccessful!")
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
            <h2>Account details</h2>
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
        <h2>Choose your theme</h2>
        <hr className="AccLine"></hr>

        <label>Background color</label>
        <input type="color" onChange={(e) => setBg(e.target.value)}/>
        <label>Text color</label>
        <input type="color" onChange={(e) => setTxtColor(e.target.value)}/>
        <label>Upload a banner</label>
        <div className="mb-4">
        <input
          id="uploadBanner"
          type="file"
          onChange={(e) => setBanner(e.target.files[0])}
          accept=".png"
          hidden
        />
        <label htmlFor="uploadBanner" className="uploadBtn">
          <FaUpload className="upload-icn" /> Choose a banner
        </label>
      </div>
    {bg||txtColor||banner?<button onClick={()=>{console.log(banner);console.log(bg);HandleThemeUpload()}} className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded mb-2">Upload theme</button>:<></>}
        <div>
        <h2>Edit your avatar</h2>
        <ImageEditor img={user.avatar}/>
        </div>  
        </div>
    )
}