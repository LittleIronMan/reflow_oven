import {Component} from 'react';
import page from 'styles/page.scss';
import style from './PageMain.scss';
import {sync, globalStore} from '../../../reflow_oven_store.js';

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
            current temperature = {this.state.tempValue}&deg;C
        </div>;
    }
}

class ControlButtons extends Component {
    startProcess = () => {
        socket.emit('client cmd', {cmdTypeStr: 'START'});
    };
    finishProcess = () => {
        socket.emit('client cmd', {cmdTypeStr: 'STOP'});
    };
    render() {
        return <div className={style.controlButtons}>
            <button className={style.start} onClick={this.startProcess}>Start Program</button>
            <button className={style.stop} onClick={this.finishProcess}>Stop Program</button>
        </div>;
    }
}

class GraphLayer extends Component {
    constructor(props) {
        super(props);
    }

    drawGraph = (arr, params) => {
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
        let firstPointTime = 0;
        for (let i = 0; i < arr.length; i++) {
            let data = { temp: arr[i].temp, time: arr[i].time };
            if (arr[i].mills !== undefined) { data.time += arr[i].mills / 1000; }
            if ((globalStore.data.lastRealTimeMeasure - data.time) > params.viewPeriod) { continue; } // слишком старые данные не рисуем

            if (firstPoint) { firstPointTime = data.time; }

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
                viewPeriod: 20,
                maxTemp: 220,
                viewMode: 'real time'
            }
        };
    }

    updateGraphView = () => {
        if (this._realMeasureGraph) {
            this._realMeasureGraph.drawGraph(globalStore.data.realPoints, this.state.viewParams);
        }
        if (this._idealGraph) {
            this._idealGraph.drawGraph(globalStore.data.tempProfile, this.state.viewParams);
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
