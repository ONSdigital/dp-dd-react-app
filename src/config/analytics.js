import ga from 'react-ga';

export default class analytics {
    static initialise() {
        ga.initialize('UA-52416772-2');
    }

    static logPageView() {
        const path = window.location.pathname + (window.location.search || ``);

        ga.set({
            page: path
        });
        ga.pageview(path);
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
