import React from 'react';
export default function DownloadInProgress({title}) {
    return (
       <div>
            <h1 className="margin-top--4 margin-bottom">Download options</h1>
            <p className="margin-top--0 margin-bottom--8 font-size--17 loading">Your file is being generated</p>
        </div>
    )
}