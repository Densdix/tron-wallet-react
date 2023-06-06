import React from "react"
import preloader from "../../../images/preloader.svg"


const Preloader = () => {
    return(
        <div className="preloader">
            <img className="spiner" src={preloader} alt="preloader"/>
        </div>
    )
}

export default Preloader