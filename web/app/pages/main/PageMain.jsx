import {Component} from 'react';
import page from 'styles/page.scss';
import style from './PageMain.scss';
import {globalStore} from '../../../reflow_oven_store.js';

class TempMonitor extends Component {
    constructor(props) {
        super(props);
        this.state = {tempValue: 0};
    }

    componentDidMount() {
        globalVar.updateTempLabel = () => {
            let arr = globalStore.data.realPoints;
            let lastTemp = 0;
            if (arr.length > 0) { lastTemp = arr[arr.length - 1].temp; }
            this.setState({tempValue: lastTemp})
        };
    }

    render() {
        return <div className={style.tempMonitor}>
            <div className={style.row}>
                <div className={style.label}>current temperature</div>
                <div className={style.value}>{this.state.tempValue}&deg;C</div>
            </div>
        </div>;
    }
}

class ControlButtons extends Component {
    sendCommand = (cmd) => {
        socket.emit('client cmd', {cmdTypeStr: cmd});
    };
    render() {
        return <div className={style.controlButtons}>
            <button className={style.start} onClick={() => this.sendCommand('START')}>Start Program</button>
            <button className={style.stop} onClick={() => this.sendCommand('STOP')}>Stop Program</button>
            <button className={style.reset} onClick={() => this.sendCommand('CLIENT_REQUIRES_RESET')}>Reset</button>
            <br/>
            <button className={style.manualControl} onClick={() => this.sendCommand('SET_MANUAL_CONTROL')}>manual control</button>
            <button className={style.on} onClick={() => this.sendCommand('MANUAL_TURN_ON')}>on</button>
            <button className={style.off} onClick={() => this.sendCommand('MANUAL_TURN_OFF')}>off</button>
            <button className={style.automaticControl} onClick={() => this.sendCommand('SET_AUTOMATIC_CONTROL')}>automatic control</button>
        </div>;
    }
}

class GraphLayer extends Component {
    constructor(props) {
        super(props);
    }

    drawGraph = (arr, params, timeOffset) => {
        let canvas = this.canvas;
        let context = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.strokeStyle = this.props.strokeStyle ? this.props.strokeStyle : 'gray';
        context.lineWidth = 3;

        if (arr.length === 0) {
            console.log("empty current points array");
            return;
        }
        if (arr.length < 2) {
            return;
        }

        let firstPoint = true;
        let firstPointTime = globalStore.data.lastRealTimeMeasure - params.viewPeriod;
        for (let i = 0; i < arr.length; i++) {
            if (!firstPoint && arr[i].time === 0) { break; } // выходим из цикла, если наткнулись на невалидный элемент массива
            let data = { temp: arr[i].temp, time: arr[i].time + timeOffset};
            if ((globalStore.data.lastRealTimeMeasure - data.time) > params.viewPeriod) { continue; } // слишком старые данные не рисуем

            let x = ((data.time - firstPointTime) / params.viewPeriod) * canvas.width;
            let y = (1 - data.temp/params.maxTemp) * canvas.height;

            if (firstPoint) { context.moveTo(x, y); firstPoint = false; }
            else { context.lineTo(x, y); }
        }
        context.stroke();
    };

    render() {
        let className = style.graphLayer + (this.props.superClass ? (" " + this.props.superClass) : "");
        return <canvas id={this.props.id} className={className} ref={(domNode) => {this.canvas = domNode;}}/>
    }
}

class GraphView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            realPoints: [],
            idealPoints: [],
            viewParams: {
                viewPeriod: 200,
                maxTemp: 220,
                viewMode: 'real time'
            }
        };
    }

    updateGraphView = () => {
        if (this._realMeasureGraph) {
            this._realMeasureGraph.drawGraph(globalStore.data.realPoints, this.state.viewParams, 0);
        }
        if (this._idealGraph) {
            this._idealGraph.drawGraph(globalStore.data.tempProfile, this.state.viewParams, globalStore.data.startTime);
        }
    };

    componentDidMount() {
        globalVar.updateRealTimeView = () => {
            this.updateGraphView();
        };
        window.addEventListener("resize", this.updateGraphView);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateGraphView);
    }

    render() {
        return <div className={style.graphView}>
            <GraphLayer id='backLayer' superClass={style.backLayer}/>
            <GraphLayer id='layerIdeal' ref={(domNode) => {this._idealGraph = domNode;}}/>
            <GraphLayer id='layerReal' strokeStyle={'#ff5a88'} ref={(domNode) => {this._realMeasureGraph = domNode;}}/>
        </div>;
    }
}

class PageMain extends Component {
    render() {
        return <div className={page.default}>
            Oven Control Panel
            <TempMonitor/>
            <ControlButtons/>
            <GraphView/>
        </div>;
    }
}

export default PageMain;
