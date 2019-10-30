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
        return <div className={'col-md-6 col-12 ' + style.tempMonitor}>
            <table><tbody>
                <tr>
                    <td className={style.label}>current temperature</td>
                    <td className={style.value}>
                        {this.props.currentTemp}&deg;C
                    </td>
                </tr>
                <tr>
                    <td className={style.label}>oven state</td>
                    <td className={style.value} style={{backgroundColor: this.props.ovenState === 'ON' ? '#ff522a' : '#1bffe9'}}>
                        {this.props.ovenState}
                    </td>
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
    let arr = state.get('realPoints');
    return {
        currentTemp: (arr.length > 0 ? arr[arr.length - 1].temp : 0),
        programState: state.get('programState'),
        ovenState: state.get('ovenState'),
        controlMode: state.get('controlMode')
    }
})(TempMonitor);

class ControlButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processPercent: props.processPercent
        };
    }
    sendCommand = (cmd, value=null) => {
        socket.emit('client cmd', {
            cmdTypeStr: cmd,
            cmdValue: value
        });
    };
    render() {
        return <div className={'col-md-6 col-12 ' + style.controlButtons}>
            <div className={style.selectable}>
                <table className={style.manualControl}><tbody>
                    <tr>
                        <td colSpan="3">
                            manual control
                        </td>
                    </tr>

                    {/*кнопки для ручного управления*/}
                    <tr>
                        <td>
                            <button style={{backgroundColor: "#6bd8ff"}}
                                    onClick={() => this.sendCommand('MANUAL_OFF')}>
                                turn off
                            </button>
                        </td>
                        <td>
                            <button style={{backgroundColor: "rgba(255,16,10,0.38)"}}
                                    onClick={() => this.sendCommand('MANUAL_KEEP_CURRENT')}>
                                keep current
                            </button>
                        </td>
                        <td>
                            <button style={{backgroundColor: "#ff573f"}}
                                    onClick={() => this.sendCommand('MANUAL_ON')}>
                                turn on
                            </button>
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

                    {/*кнопки управления процесса нагревания с термопрофилем*/}
                    <tr>
                        <td>
                            <button className={style.x2}
                                    style={{backgroundColor: "#ff7474"}}
                                    onClick={() => this.sendCommand('FTP_STOP')}>
                                stop
                            </button>
                        </td>
                        <td>
                            <button className={style.x2}
                                    style={{backgroundColor: "rgba(116,255,116,0.53)"}}
                                    onClick={() => this.sendCommand('FTP_START_BG')}>
                                run in background
                            </button>
                        </td>
                        <td>
                            <button className={style.x2}
                                    style={{backgroundColor: "#74ff74"}}
                                    onClick={() => this.sendCommand('FTP_START')}>
                                run
                            </button>
                        </td>
                    </tr>

                    {/*кнопки управления ВРЕМЕНЕМ процесса нагревания с термопрофилем*/}
                    <tr>
                        <td>
                            {(this.props.finishTime !== 0 ? (this.state.elapsedTime / this.props.finishTime) : 0) * 100}%
                        </td>
                        <td>
                            {this.state.elapsedTime / 60}:{this.state.elapsedTime % 60}/{this.props.finishTime / 60}:{this.props.finishTime % 60}
                        </td>
                        <td>
                            <button onClick={() => this.sendCommand(this.props.isPaused ? 'FTP_RESUME' : 'FTP_PAUSE')}>
                                {this.props.isPaused ? 'resume' : 'pause'}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3">
                            <input className={style.processSlider}
                                   type="range"
                                   min="0"
                                   max={this.props.finishTime}
                                   value={this.state.elapsedTime}
                                   onChange={()=>{
                                       this.setState({elapsedTime: event.target.value});
                                   }}
                                   onMouseUp={()=>{
                                       this.sendCommand('FTP_SET_TIME', this.state.elapsedTime);
                                   }}
                            />
                        </td>
                    </tr>
                </tbody></table>
            </div>
            {/*<div className={style.selectable}>*/}
            {/*    <table><tbody>*/}
            {/*        <tr>*/}
            {/*            <td>*/}
            {/*                hold const temp*/}
            {/*            </td>*/}
            {/*        </tr>*/}
            {/*        <tr>*/}
            {/*            <td>*/}
            {/*                <input type="range"*/}
            {/*                       min="1"*/}
            {/*                       max="100"*/}
            {/*                       value='50'*/}
            {/*                       onChange={()=>{*/}
            {/*                       }}*/}
            {/*                />*/}
            {/*            </td>*/}
            {/*        </tr>*/}
            {/*    </tbody></table>*/}
            {/*</div>*/}
            <button style={{backgroundColor: "#6193ff"}} onClick={() => this.sendCommand('CLIENT_REQUIRES_RESET')}>Reset MCU</button>
            <button style={{backgroundColor: "#0c0d29", color: "#c7d4ff"}} onClick={() => this.sendCommand('SUDO_HALT')}>sudo halt</button>
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
                <GraphLayer id='layerIdeal' ref={(domNode) => {this._idealGraph = domNode;}}/>
                <GraphLayer id='layerReal' strokeStyle={'#ff5a88'} ref={(domNode) => {this._realMeasureGraph = domNode;}}/>
                <GraphLayer id='backLayer' superClass={style.backLayer}/>
            </div>
        </div>;
    }
}
const GraphViewRedux = connect()(GraphView);

class PageMain extends Component {
    render() {
        return <div className={"container-fluid " + page.default + ' ' + style.ui}>
            <div className={"row"}>
                <div className={"col-12 " + style.title}>
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
