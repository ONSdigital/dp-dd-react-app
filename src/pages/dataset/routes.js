import Details from './components/Details'
import Download from './components/Download'
import Customise from './components/Customise'

export default [
    { path: 'dd/dataset/:id', component: Details },
    { path: 'dd/dataset/:id/download', component: Download },
    { path: 'dd/dataset/:id/customise(/:dimensionID)', component: Customise }
]
