
import { memo, useState } from "react";
import placeholder from "../../../photo/button/select photo.png"

function Accountphoto({ photoref ,show}) { 

    const [photo, setphoto] = useState(placeholder);

    const selectphoto = (e) => {
        let photo = e.currentTarget.files[0];
        if (photo) {
            let filereader = new FileReader();
            filereader.readAsDataURL(photo);
            filereader.onload = function () {
                setphoto(filereader.result);
            }
        }
    }

    return (
        <main className="formuserphotoselect" style={ { display: show ? "flex" : "none" } }>
            <label htmlFor="photoselector" className="h-100 w-100 d-flex justify-content-center align-items-center flex-column">
                <img src={ photo } alt="selector" />
                <span>click here to peek photo</span>
                <span>choose your personal photo (optional)</span>
            </label>
            <input ref={ photoref } id="photoselector" type="file" style={ { display: "none" } } onChange={selectphoto} />
        </main>
    )
}

export default memo(Accountphoto);