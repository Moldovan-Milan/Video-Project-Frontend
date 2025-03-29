import React from 'react'
import UserAccountDetailsPanel from './UserAccountDetailsPanel'
import UserAccountVideosPanel from './UserAccountVideosPanel'
import UserAccountHeader from './UserAccountHeader'
import { useState } from 'react'

const UserEditComponent = ({userData, userVideos}) => {
    const[switchPanel,setSwitchPanel]=useState("Videos");
    return (
        <div className="container">
            <UserAccountHeader user={userData}/>
            <div className="divUserAccPanelSwitch">
                    <button
                    className={
                        switchPanel === "Videos"
                        ? "btnUserAccPanelActive"
                        : "btnUserAccBottomPanel"
                    }
                    onClick={() => setSwitchPanel("Videos")}
                    >
                    Edit videos
                    </button>
                    <button
                    className={
                        switchPanel === "Details"
                        ? "btnUserAccPanelActive"
                        : "btnUserAccBottomPanel"
                    }
                    onClick={() => setSwitchPanel("Details")}
                    >
                    Details
                    </button>
                </div>
                <div>
                    {switchPanel === "Videos" ? (
                    <UserAccountVideosPanel videos={userVideos}/>
                    ) : (
                    <UserAccountDetailsPanel userData={userData}/>
                    )}
                </div>
            </div> 
    )
}

export default UserEditComponent