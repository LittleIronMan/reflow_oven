import {Component} from 'react';
import page from 'styles/page.scss';
import style from './PageMain.scss';
import {connect} from 'react-redux';
//import {actions} from '../../../actions.js';
import reduxStore from'../../../store.js';

var newTempMeasureEventListener = {
    lastId: 0,
    subscribers: {},
    subscribe: function(callback) {
        const id = this.lastId; this.lastId++;
        this.subscribers[id] = callback;
        return () => {delete this.subscribers[id];}
    },
    emit: function(lastTime) {
        Object.keys(this.subscribers).forEach((key) => {
            this.subscribers[key](lastTime);
        });
    }
};

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
                    <td className={style.value}>{this.props.leadControlMode}</td>
                </tr>
            </tbody></table>
        </div>;
    }
}
const TempMonitorRedux = connect((state, ownProps) => {
    let arr = state.get('realPoints');
    return {
        currentTemp: (arr.length > 0 ? arr[arr.length - 1].temp : 0),
        ovenState: state.get('fControlData').ovenState,
        leadControlMode: state.get('fControlData').leadControlMode
    }
})(TempMonitor);

function sendCommand(cmd, acmIdx=null, value=null) {
    console.log('Send command ', cmd);
    socket.emit('client cmd', {
        cmdTypeStr: cmd,
        acmIdx: acmIdx,
        value: value
    });
}

class ManualControlWidget extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className={style.selectable}>
            <table><tbody>
                <tr>
                    <td colSpan="3">
                        manual control
                    </td>
                </tr>

                {/*кнопки для ручного управления*/}
                <tr>
                    <td>
                        <button style={{backgroundColor: "#6bd8ff"}}
                                onClick={() => sendCommand('MANUAL_OFF')}>
                            turn off
                        </button>
                    </td>
                    <td>
                        <button style={{backgroundColor: "rgba(255,16,10,0.38)"}}
                                onClick={() => sendCommand('MANUAL_KEEP_CURRENT')}>
                            keep current
                        </button>
                    </td>
                    <td>
                        <button style={{backgroundColor: "#ff573f"}}
                                onClick={() => sendCommand('MANUAL_ON')}>
                            turn on
                        </button>
                    </td>
                </tr>
            </tbody></table>
        </div>
    }
}
const ManualControlWidgetRedux = connect()(ManualControlWidget);

function timeValueToClockView(time) {
    return `${Math.floor(time / 60)}:${Math.floor(time % 60)}`;
}

class AutomaticControlWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elapsedTime: props.elapsedTime
        };
        this.timeSliderPressed = false;
    }
    componentDidMount() {
        this.unsubscribe = newTempMeasureEventListener.subscribe((lastTempMeasureTime) => {
            if (this.props.controlState !== 'DISABLED' && !this.props.isPaused && !this.timeSliderPressed) {
                this.setState({elapsedTime: lastTempMeasureTime - this.props.startTime});
            }
        });
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return <div className={style.selectable}>
            <table><tbody>
                <tr>
                    <td colSpan="3">
                        {this.props.title}
                    </td>
                </tr>

                {/*кнопки управления процесса нагревания с термопрофилем*/}
                <tr>
                    <td>
                        <button className={style.x2}
                                style={{backgroundColor: "#ff7474"}}
                                onClick={() => sendCommand('STOP', this.props.acmIdx)}>
                            stop
                        </button>
                    </td>
                    <td>
                        <button className={style.x2}
                                style={{backgroundColor: "rgba(116,255,116,0.53)"}}
                                onClick={() => sendCommand('START_BG', this.props.acmIdx)}>
                            run in background
                        </button>
                    </td>
                    <td>
                        <button className={style.x2}
                                style={{backgroundColor: "#74ff74"}}
                                onClick={() => sendCommand('START', this.props.acmIdx)}>
                            run
                        </button>
                    </td>
                </tr>

                {/*кнопки управления ВРЕМЕНЕМ процесса нагревания с термопрофилем*/}
                <tr>
                    <td>
                        {Math.round((this.props.duration !== 0 ? (this.state.elapsedTime / this.props.duration) : 0) * 100)}%
                    </td>
                    <td>
                        {timeValueToClockView(this.state.elapsedTime)}/{timeValueToClockView(this.props.duration)}
                    </td>
                    <td>
                        <button onClick={() => sendCommand(this.props.isPaused ? 'RESUME' : 'PAUSE', this.props.acmIdx)}>
                            {this.props.isPaused ? 'resume' : 'pause'}
                        </button>
                    </td>
                </tr>
                <tr>
                    <td colSpan="3">
                        <input className={style.processSlider}
                               type="range"
                               min="0"
                               max={this.props.duration}
                               value={this.state.elapsedTime}
                               onChange={()=>{
                                   if (this.props.controlState !== 'DISABLED') {
                                       this.setState({elapsedTime: event.target.value});
                                   }
                               }}
                               onMouseDown={()=>{
                                   this.timeSliderPressed = true;
                               }}
                               onMouseUp={()=>{
                                   this.timeSliderPressed = false;
                                   sendCommand('SET_TIME', this.props.acmIdx, this.state.elapsedTime);
                               }}
                        />
                    </td>
                </tr>
            </tbody></table>
        </div>
    }
}
const AutomaticControlWidgetRedux = connect((state, ownProps) => {
    return {
        ...state.get('fControlData').data[ownProps.acmIdx],
    }
})(AutomaticControlWidget);

class ControlButtons extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className={'col-md-6 col-12 ' + style.controlButtons}>
            <ManualControlWidgetRedux title='Manual control'/>
            <AutomaticControlWidgetRedux title='Follow temp profile' acmIdx={0}/>
            <AutomaticControlWidgetRedux title='Hold const temp' acmIdx={1}/>

            <button style={{backgroundColor: "#6193ff"}} onClick={() => sendCommand('CLIENT_REQUIRES_RESET')}>Reset MCU</button>
            <button style={{backgroundColor: "#0c0d29", color: "#c7d4ff"}} onClick={() => sendCommand('SUDO_HALT')}>sudo halt</button>
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
            this._idealGraph.drawGraph(state.get('tempProfile'), this.state.viewParams, state.get('fControlData').data[0].startTime);
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
                <ControlButtons/>
                <GraphViewRedux/>
            </div>
        </div>;
    }
}

export { PageMain, newTempMeasureEventListener };
