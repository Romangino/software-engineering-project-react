import {Link, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import * as groupService from "../../services/groups-service"
import * as authService from "../../services/auth-service"
import ChatList from "./chat-list";
import * as messageService from "../../services/messages-service"
import MemberListNoButton from "./member-list-noButton";

const Chat = () => {
    const navigate = useNavigate()
    const path = useLocation().pathname.split("/")
    const gid = path[3]
    const [group, setGroup] = useState({})
    const [chat, setChat] = useState([])
    const [currentUser, setCurrentUser] = useState({})

    const findGroupByGroupId = () =>
        groupService.findGroupByGroupId(gid)
            .then((group) => setGroup(group))
    const [profile, setProfile] = useState({})

    const findAllMessagesInGroup = async () =>
        messageService.findAllMessagesInGroup(gid)
            .then((chat) => setChat(chat))


    const userLeavesGroup = async () => {
        const memberIndex = group.members.indexOf(currentUser._id)
        const adminIndex = group.admin.indexOf(currentUser._id)

        if (memberIndex > -1) {
            group.members.splice(memberIndex, 1)
        }
        if (adminIndex > -1) {
            group.admin.splice(adminIndex, 1)
        }
        if (group.members.length === 0) {
            await groupService.deleteGroup(currentUser._id, gid)
            navigate('/messages')
        } else {
            await groupService.updateGroup(gid, group)
            navigate('/messages')
        }
    }

    const userEditsGroup = async () => {
        if (group.admin.includes(currentUser._id)) {
            navigate(`/messages/chat/${group._id}/edit`)
        } else {
            alert('You cannot edit a group unless you are an admin for that group')
        }
    }

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const currentUser = await authService.profile()
                setCurrentUser(currentUser)
                const groupData =  await groupService.findGroupByGroupId(gid)
                setGroup(groupData)
            } catch (e) {
                navigate('/')
            }
        }
        fetchLoggedInUser()
        findGroupByGroupId()
        findAllMessagesInGroup()
    }, [gid])

    return(
        <div className={'rounded-3 bg-light p-2'}>
            <div className={'row ps-2'}>
                <div className={'col p-2'}>
                    <h2 className={'pt-1'}>
                        {group.groupName}
                    </h2>
                    <p>
                        {group.description}
                    </p>
                    <h4>Group Members:</h4>
                    <MemberListNoButton key={2} group={group} memberList={group.members}/>
                    <hr/>
                </div>
                <div className={'col p-2'}>
                    <div className={'row pe-2'}>
                        <div className='col-8 p-0'>
                            <Link to={`/messages/chat/${group._id}/edit`}>
                                <button className='btn btn-primary float-end'>
                                    Edit
                                </button>
                            </Link>

                        </div>
                        <div className='col ps-0'>
                            <button className='btn btn-danger float-end'
                                    onClick={userLeavesGroup}>
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <ChatList chats={chat} group={group} currentUser={currentUser}/>
            </div>


        </div>
    )
}
export default Chat
