import React from 'react';
import analytics from '../../../config/analytics';
import SupportingFilesList from '../../../components/elements/SupportingFilesList';
import { Link } from 'react-router';

export default function DownloadComplete({ files }) {
    return (
        <div>
            <h1 className="margin-top--4 margin-bottom">Download options</h1>
            <p className="margin-top--0 margin-bottom--1">These files are available for you to download.</p>

            {files.map((file, index) => {
                return (
                    <div key={index} className="margin-top--1">
                        <a onClick={analytics.logGoalCompleted}
                           href={file.url}
                           className="btn btn--primary btn--thick btn--wide btn--big uppercase"
                        >{file.name.slice(-3).toUpperCase()}</a>
                    </div>
                )
            })}

            <SupportingFilesList/>

            <Link className="btn btn--primary btn--thick btn--wide btn--big">Download all as a ZIP</Link>
        </div>
    )
}