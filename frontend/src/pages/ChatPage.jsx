import React from 'react'
import toast from 'react-hot-toast'

const ChatPage = () => {
    return (
        <div>ChatPage
            <button onClick={() => {
                toast.success('Successfully toasted!')
            }}>Send Message</button>
        </div>
    )
}

export default ChatPage