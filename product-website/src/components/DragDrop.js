import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["LOG"];

function DragDrop(props) {

    const [file, setFile] = useState(null);

    function onTrigger(file, filename) {
        props.parentCallback(file, filename);
    };

    const handleChange = (file) => {
        setFile(file);
        if (file) {
            // document.getElementById('confirmBtn').disabled = false;
            onTrigger(file, file.name);
        }
    };
    return (
        <FileUploader handleChange={handleChange} name="file" types={fileTypes}/>
    );
}

export default DragDrop;