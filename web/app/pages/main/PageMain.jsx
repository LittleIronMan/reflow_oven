import {Component} from 'react';
import page from 'styles/page.scss';
import style from './PageMain.scss';

class TempMonitor extends Component {
    render() {
        return <div className={style.tempMonitor}>
            current temperature = 0&deg;C
        </div>;
    }
}

class PageMain extends Component {
    render() {
        return <div className={page.default}>
            Oven Control Panel
            <TempMonitor/>
        </div>;
    }
}

export default PageMain;
