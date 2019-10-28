import {Component} from 'react';
import page from 'styles/page.scss';
import style from './PageMain.scss';
import {connect} from 'react-redux';
//import {actions} from '../../../actions.js';
import reduxStore from'../../../store.js';

class TempMonitor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let arr = this.props.realPoints;
        return <div className={'col-6 ' + style.tempMonitor}>
            <table><tbody>
                <tr>
                    <td className={style.label}>current temperature</td>
                    <td className={style.value}>
                        {arr.length > 0 ? arr[arr.length - 1].temp : 0}&deg;C
                    </td>
                </tr>
                <tr>
                    <td className={style.label}>oven state</td>
                    <td className={style.value}>{this.props.ovenState === 0 ? 'OFF' : 'ON'}</td>
                </tr>
                <tr>
                    <td className={style.label}>control mode</td>
                    <td className={style.value}>{this.props.controlMode}</td>
                </tr>
                <tr>
                    <td className={style.label}>program state</td>
                    <td className={style.value}>{this.props.programState}</td>
                </tr>
            </tbody></table>
        </div>;
    }
}
const TempMonitorRedux = connect((state, ownProps) => {
    return {
        realPoints: state.get('realPoints'),
        programState: state.get('programState'),
        ovenState: state.get('ovenState'),
        controlMode: state.get('controlMode')
    }
})(TempMonitor);

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
                <table className={style.manualControl}><tbody>
                    <tr>
                        <td colSpan="3">
                            manual control
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
                </tbody></table>
            </div>
            <div className={style.selectable}>
                <table className={style.automaticControl}><tbody>
                    <tr>
                        <td colSpan="3">
                            follow temp profile
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button className={style.stop} onClick={() => this.sendCommand('STOP')}>stop</button>
                        </td>
                        <td>
                            <button className={style.start} onClick={() => this.sendCommand('START')}>run in background</button>
                        </td>
                        <td>
                            <button className={style.start} onClick={() => this.sendCommand('START')}>run</button>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3">
                            <input className={style.processSlider}
                                   type="range"
                                   min="1"
                                   max="100"
                                   value='50'/*{this.state.processPercent}*/
                                   onChange={()=>{
                                       this.setState({processPercent: event.target.value});
                                   }}
                            />
                        </td>
                    </tr>
                </tbody></table>
            </div>
            <div className={style.selectable}>
                <table><tbody>
                    <tr>
                        <td>
                            hold const temp
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
                </tbody></table>
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
        let lastRealTimeMeasure = reduxStore.getState().get('lastRealTimeMeasure');
        let firstPointTime = lastRealTimeMeasure - params.viewPeriod;
        for (let i = 0; i < arr.length; i++) {
            if (!firstPoint && arr[i].time === 0) { break; } // выходим из цикла, если наткнулись на невалидный элемент массива
            let data = { temp: arr[i].temp, time: arr[i].time + timeOffset};
            if ((lastRealTimeMeasure - data.time) > params.viewPeriod) {
                if ((i + 1 < arr.length) && (lastRealTimeMeasure - (arr[i + 1].time + timeOffset) <= params.viewPeriod)) {
                    // отрезок можно рисовать, если хотябы одна из его точек входит в видимую область
                }
                else {
                    continue; // а те что не входят в видимую область - не рисуем(слишком старые данные)
                }
            }

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
            this._realMeasureGraph.drawGraph(state.get('realPoints'), this.state.viewParams, 0);
        }
        if (this._idealGraph) {
            this._idealGraph.drawGraph(state.get('tempProfile'), this.state.viewParams, state.get('startTime'));
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
        return <div className={'col-12'}>
            <div className={style.graphView}>
                <GraphLayer id='backLayer' superClass={style.backLayer}/>
                <GraphLayer id='layerIdeal' ref={(domNode) => {this._idealGraph = domNode;}}/>
                <GraphLayer id='layerReal' strokeStyle={'#ff5a88'} ref={(domNode) => {this._realMeasureGraph = domNode;}}/>
            </div>
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
