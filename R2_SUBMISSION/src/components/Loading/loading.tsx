import React from "react";
import "./LoadingSpinner.css";

export default function LoadingSpinner(): JSX.Element {
    return (
        <div className="spinner-container">
            <center>
                <div className="loading-spinner"></div>
            </center>
        </div>
    );
}