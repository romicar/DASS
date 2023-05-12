import React from 'react'
import './DialogBox.css'

const DialogBox = ({ setVisible, text }: {
    setVisible: React.Dispatch<React.SetStateAction<Boolean>>,
    text: string
}) => {

    return (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => setVisible(false)}>&times;</span>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default DialogBox