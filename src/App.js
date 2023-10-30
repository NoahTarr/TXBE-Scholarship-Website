import { useState, useEffect } from "react";
import { ajax } from "jquery";
import "./App.css";

/*
{
    overline: <Info text about header>,
    header: <Scholarship name>,
    content: <Description of each scholarhip>,
    img: <File name for image in drive>,
    img_path: <Generated url from img name>,
    button_text: <Text content of the button>,
    button_link: <Link to open on button press>,
}
*/

const SHEETS_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0VWYCAylxTAl7qKaQYJStti-9Ty26_rB5JFs7UyNUYLhUkwhVlHjq9kzF29h_sGGPTk2AauybM0Ka/pub?output=tsv";
const fetchSiteContentFromGoogle = (contentUpdater) => {
    ajax({
        url: SHEETS_URL,
        success: function (response) {
            console.log("response: ", response);
            const responseInJson = tsvToJson(response);
            contentUpdater(responseInJson);
        },
        error: function (err) {
            console.log(err.status);
        },
    });
};

/**
 * Converts TSV data to JSON
 * @param {string} tsv Data in tsv format
 * @returns json object
 */
function tsvToJson(tsv) {
    var lines = tsv.split("\r\n");
    var results = [];
    var headers = lines[0].split("\t");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split("\t");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        results.push(obj);
    }

    return results;
}

function App() {
    const [content, setContent] = useState();

    useEffect(() => {
        fetchSiteContentFromGoogle(setContent);
    }, []);

    useEffect(() => {
        console.log("content: ", content);
    }, [content]);

    return (
        <div className="root">
            {content &&
                content.map((row, index) => {
                    const contentCol = (
                        <div className="col">
                            <h2>{row.overline}</h2>
                            <h1>{row.header}</h1>
                            <p>{row.content}</p>
                            {row.button_text && row.button_link && (
                                <a href={row.button_link} target="_blank">
                                    <button>{row.button_text}</button>
                                </a>
                            )}
                        </div>
                    );
                    const imgCol = (
                        <div className="col">
                            <img src={row.img_path} />
                        </div>
                    );

                    if (index % 2 === 0)
                        return (
                            <div key={row.header} className="row">
                                <div className="inner-row-container">
                                    {contentCol}
                                    {imgCol}
                                </div>
                            </div>
                        );
                    return (
                        <div key={row.header} className="row">
                            <div className="inner-row-container">
                                {imgCol}
                                {contentCol}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}

export default App;
