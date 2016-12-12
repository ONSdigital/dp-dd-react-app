import React from 'react';
import { Link } from 'react-router';

export default (props) => {
    return (
        <div>
            <div className="col--lg-two-thirds">
                <h1 className="margin-bottom-md--0">Members of the Armed Forces by residence type by sex by age</h1>
                <p className="page-intro__content margin-bottom-md--1">This dataset provides 2011 Census estimates that classify usual residents aged 16 and over who are members of the armed forces by residence type (household or communal resident), by sex and by age.</p>

                <p className="page-intro__content margin-bottom-md--3">The estimates are as at census day, 27 March 2011</p>


                <Link to={`/dataset/${props.params.id}/download`}
                   className="btn btn--primary btn--thick btn--big btn--wide">Download the complete dataset &gt;</Link>
                <br />
                <Link to={`/dataset/${props.params.id}/customise`}
                   className="btn btn--primary btn--thick btn--big btn--wide margin-top--2">Customise this dataset</Link>

                <p className="margin-bottom--0 margin-top--4">
                    <strong>Supporting information</strong><br />
                    &middot;&nbsp;<a href="./files/background-notes.pdf" target="_blank">Background notes</a> (PDF, 168KB)
                </p>
            </div>
        </div>
    )
}