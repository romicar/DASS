import { Link } from "react-router-dom";
import CreatePage from "./Create";
import DisplayTemplate from "./Create/DisplayTemplate";
import DisplayMeditation from "./Create/DisplayMeditation"
import CreateTemplate from "./Create/CreateTemplate";
import EditTemplate from "./Create/EditTemplate";
import CreateMeditation from "./Create/CreateMeditation";
import EditMeditation from "./Create/EditMeditation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import img from "../../img/unnamed.webp"

type ItemProps = {
    page: string
}

export const Item = ({ page }: ItemProps) => {
    // window.alert(page);
    if (page === "homepage") {
        return <div id="page" style={{
            overflow: "hidden",
            padding: "0"
        }}>
            {/* <CreatePage /> */}
            <img src={img} alt="atom" style={{ height: "100vh", width: "100%", overflow: "hidden", margin: "0" }} />
        </div>;
    }
    else if (page === "Templates") {
        return (<div>
            <DisplayTemplate />
        </div>);
    }
    else if (page === "Meditations") {
        return (<div>
            <DisplayMeditation />
        </div>);
    }
    else if (page === "createTemplate") {
        return (<div>
            <CreateTemplate />
        </div>);
    }
    else if (page === "editTemplate") {
        return (<div>
            <EditTemplate />
        </div>);
    }
    else if (page === "createMeditation") {
        return (<div>
            <CreateMeditation />
        </div>);
    }
    else if (page === "editMeditation") {
        return (<div>
            <EditMeditation />
        </div>);
    }
    else {
        return (
            <div id="page">
                <Link to="/">
                    <button className="btn">
                        <ArrowBackIcon /> Back to Home
                    </button>
                </Link>
                {page}
            </div>
        );
    }
};