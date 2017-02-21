import ga from 'react-ga';

const analyticsID = `UA-56892037-14`;

export default class analytics {

    static initialise() {
        ga.initialize(analyticsID);
    }

    static logPageView() {
        const path = window.location.pathname + (window.location.search || ``);

        ga.set({
            page: path
        });
        ga.pageview(path);
    }

    static logHierarchyAddAll() {
        ga.event({
            category: 'Hierarchy selector',
            action: 'Click',
            label: 'Add all'
        })
    }

    static logGoalCompleted() {
        ga.event({
            category: 'Download',
            action: 'Click',
            label: 'CSV',
            value: 1
        })
    }

}
