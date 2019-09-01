import {Component} from 'react';
import page from 'styles/page.scss';
import style from './PageMain.scss';

class TempMonitor extends Component {
    constructor(props) {
        super(props);
        this.state = {tempValue: 0};
    }

    componentDidMount() {
        tempLabel.update = (data) => this.setState({tempValue: data});
    }

    render() {
        return <div className={style.tempMonitor}>
            current temperature = {this.state.tempValue}&deg;C
        </div>;
    }
}

class ControlButtons extends Component {
    render() {
        return <div className={style.controlButtons}>
            <button className={style.start}>Start Program</button>
            <button className={style.stop}>Stop Program</button>
        </div>;
    }
}

class PageMain extends Component {
    render() {
        return <div className={page.default}>
            Oven Control Panel
            <TempMonitor/>
            <ControlButtons/>
            <canvas className={style.graphView}></canvas>
        </div>;
    }
}

export default PageMain;
