import ImageEditor from "./ImageEditor";
import "../styles/UserAccountDetailsPanel.scss";
import { FaPencil } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import isColorDark from "../functions/isColorDark";

export default function UserAccountDetailsPanel({user})
{

    const [editing, setEditing] = useState(null);
    const [editingTheme,setEditingTheme]=useState(null);
    const [banner,setBanner]=useState(null);
    const [bg,setBg]=useState(null);
    const [primaryColor,setPrimaryColor]=useState(null);
    const [secondaryColor,setSecondaryColor]=useState(null);
    let editDialog = null;
    let themeDialog=null;

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
        formData.append("primaryColor",primaryColor);
        formData.append("secondaryColor",secondaryColor);
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

    if(editingTheme!=null)
    {
        themeDialog=<div className="editBg">
        <div className="editThemeWindow">
        <h1><span className="titleEditUname">{user.username}</span>'s theme</h1>
        <label className="m-1">Background color: </label>
        <input type="color" onChange={(e) => setBg(e.target.value)} defaultValue={user.userTheme&&user.userTheme.background?user.userTheme.background:null}/>
        <label className="m-1">Primary color: </label>
        <input type="color" onChange={(e) => setPrimaryColor(e.target.value)} defaultValue={user.userTheme&&user.userTheme.primaryColor?user.userTheme.primaryColor:null}/>
        <label className="m-1">Secondary color</label>
        <input type="color" onChange={(e) => setSecondaryColor(e.target.value)} defaultValue={user.userTheme&&user.userTheme.secondaryColor?user.userTheme.secondaryColor:null}/>
        <label className="m-1">Upload a banner: </label>
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
    {bg||primaryColor||secondaryColor||banner?<button onClick={()=>{console.log(banner);console.log(bg);HandleThemeUpload()}} className="text-white font-bold py-2 px-4 rounded mb-2 btnThemeUpload"><FaUpload className="m-1"/>Upload theme</button>:<></>}
        <div>
        <button onClick={() => setEditingTheme(null)} className="editUsernameCancel">Cancel</button>
        </div>
    </div>
    </div>
    }

    

    return(
        
        <div className="DivDetailsPanel">
            {editDialog}
            {themeDialog}
            <h2 style={user.userTheme&&user.userTheme.secondaryColor?{color:user.userTheme.secondaryColor}:null}>Account details</h2>
            <hr className="AccLine"></hr>
        <div className="DivAccDetails">
        <label>Channel name: </label>
        <div className="UserAccNameEditDiv">
        <p className="AccInfo" style={user.userTheme&&user.userTheme.primaryColor?{color:user.userTheme.primaryColor}:null}>{user.username}</p>
        <button className="editUnsernameBtn" onClick={()=>setEditing(user.username)} style={user.userTheme&&user.userTheme.secondaryColor?{backgroundColor:user.userTheme.secondaryColor}:null}><FaPencil className="m-1"/></button>
        </div>
        </div>
        <div className="DivAccDetails">
        <label>Email address: </label>
        <p className="AccInfo" style={user.userTheme&&user.userTheme.primaryColor?{color:user.userTheme.primaryColor}:null}>{user.email}</p>
        </div>
        <div className="DivAccDetails">
        <label>Created at: </label>
        <p className="AccInfo" style={user.userTheme&&user.userTheme.primaryColor?{color:user.userTheme.primaryColor}:null}>{user.created}</p>
        </div>
        <h2 style={user.userTheme&&user.userTheme.secondaryColor?{color:user.userTheme.secondaryColor}:null}>Choose your theme</h2>
        <hr className="AccLine"></hr>
        <button onClick={()=>setEditingTheme(true)} className="font-bold py-2 px-4 rounded mb-2 btnEditTheme m-1" style={user.userTheme&&user.userTheme.primaryColor?{backgroundColor:user.userTheme.primaryColor,color:(isColorDark(user.userTheme.primaryColor)?"white":"black")}:null}>Edit theme</button>
        
        <div>
        <h2 style={user.userTheme&&user.userTheme.secondaryColor?{color:user.userTheme.secondaryColor}:null}>Edit your avatar</h2>
        <ImageEditor img={user.avatar}/>
        </div>  
        </div>
    )
}