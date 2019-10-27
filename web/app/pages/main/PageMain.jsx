import {Component} from 'react';
import page from 'styles/page.scss';
import style from './PageMain.scss';
import {connect} from 'react-redux';
//import {actions} from '../../../actions.js';

class TempMonitor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        let arr = this.props.realPoints;
        return <div className={'col-6 ' + style.tempMonitor}>
            <table>
                <tr>
                    <td className={style.label}>current temperature</td>
                    <td className={style.value}>
                        {arr.length > 0 ? arr[arr.length - 1].temp : 0}&deg;C
                    </td>
                </tr>
                <tr>
                    <td className={style.label}>oven state</td>
                    <td className={style.value}>{this.props.ovenState}</td>
                </tr>
                <tr>
                    <td className={style.label}>control mode</td>
                    <td className={style.value}>{/*this.props.controlMode*/}</td>
                </tr>
                <tr>
                    <td className={style.label}>program state</td>
                    <td className={style.value}>{this.props.programState}</td>
                </tr>
            </table>
        </div>;
    }
}
const TempMonitorRedux = connect()(TempMonitor);

class ControlButtons extends Component {
    sendCommand = (cmd) => {
        socket.emit('client cmd', {
            cmdTypeStr: cmd,
            processPercent: 0
        });
    };
    render() {
        return <div className={'col-6 ' + style.controlButtons}>
            <div className={style.selectable}>
                <table className={style.manualControl}>
                    <tr>
                        <td colspan="3">
                            <button className={style.manualControl} onClick={() => this.sendCommand('SET_MANUAL_CONTROL')}>manual control</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button className={style.off} onClick={() => this.sendCommand('MANUAL_TURN_OFF')}>turn off</button>
                        </td>
                        <td>
                            <button className={style.on} onClick={() => this.sendCommand('MANUAL_TURN_ON')}>keep current</button>
                        </td>
                        <td>
                            <button className={style.on} onClick={() => this.sendCommand('MANUAL_TURN_ON')}>turn on</button>
                        </td>
                    </tr>
                </table>
            </div>
            <div className={style.selectable}>
                <table className={style.automaticControl}>
                    <tr>
                        <td colspan="3">
                            <button className={style.automaticControl} onClick={() => this.sendCommand('SET_AUTOMATIC_CONTROL')}>follow temp profile</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button className={style.start} onClick={() => this.sendCommand('START')}>start</button>
                        </td>
                        <td>
                            <button className={style.stop} onClick={() => this.sendCommand('STOP')}>run in background</button>
                        </td>
                        <td>
                            <button className={style.stop} onClick={() => this.sendCommand('STOP')}>run</button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <input className={style.processSlider}
                                   type="range"
                                   min="1"
                                   max="100"
                                   value={this.state.processPercent}
                                   onChange={()=>{
                                       this.setState({processPercent: event.target.value});
                                   }}
                            />
                        </td>
                    </tr>
                </table>
            </div>
            <div className={style.selectable}>
                <table>
                    <tr>
                        <td>
                            <button className={style.holdConstTemp} onClick={() => this.sendCommand('HOLD_CONST_TEMP')}>hold const temp</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="range"
                                   min="1"
                                   max="100"
                                   value='50'
                                   onChange={()=>{
                                   }}
                            />
                        </td>
                    </tr>
                </table>
            </div>
            <button className={style.sudoHalt} onClick={() => this.sendCommand('SUDO_HALT')}>sudo halt</button>
            <button className={style.reset} onClick={() => this.sendCommand('CLIENT_REQUIRES_RESET')}>Reset MCU</button>
        </div>;
    }
}
const ControlButtonsRedux = connect()(ControlButtons);

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
        let firstPointTime = reduxStore.getState().lastRealTimeMeasure - params.viewPeriod;
        for (let i = 0; i < arr.length; i++) {
            if (!firstPoint && arr[i].time === 0) { break; } // выходим из цикла, если наткнулись на невалидный элемент массива
            let data = { temp: arr[i].temp, time: arr[i].time + timeOffset};
            if ((reduxStore.getState().lastRealTimeMeasure - data.time) > params.viewPeriod) { continue; } // слишком старые данные не рисуем

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
            viewParams: {
                viewPeriod: 200,
                maxTemp: 220,
                viewMode: 'real time'
            }
        };
    }

    updateGraphView = () => {
        let state = reduxStore.getState();
        if (this._realMeasureGraph) {
            this._realMeasureGraph.drawGraph(state.realPoints, this.state.viewParams, 0);
        }
        if (this._idealGraph) {
            this._idealGraph.drawGraph(state.tempProfile, this.state.viewParams, state.startTime);
        }
    };

    componentDidMount() {
        globalVar.updateRealTimeView = () => {
            this.updateGraphView();
        };
        window.addEventListener("resize", this.updateGraphView);
        this.unsubscribe = reduxStore.subscribe(this.updateGraphView);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateGraphView);
        this.unsubscribe();
    }

    render() {
        return <div className={'col-12 ' + style.graphView}>
            <GraphLayer id='backLayer' superClass={style.backLayer}/>
            <GraphLayer id='layerIdeal' ref={(domNode) => {this._idealGraph = domNode;}}/>
            <GraphLayer id='layerReal' strokeStyle={'#ff5a88'} ref={(domNode) => {this._realMeasureGraph = domNode;}}/>
        </div>;
    }
}
const GraphViewRedux = connect()(GraphView);

class PageMain extends Component {
    render() {
        return <div className={"container-fluid " + page.default + ' ' + style.ui}>
            <div className={"row"}>
                <div className={"col-12"}>
                    Oven Control Panel
                </div>
                <TempMonitorRedux/>
                <ControlButtonsRedux/>
                <GraphViewRedux/>
            </div>
        </div>;
    }
}

export default PageMain;
