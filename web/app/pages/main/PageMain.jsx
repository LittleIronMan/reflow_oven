import {Component} from 'react';
import page from 'styles/page.scss';
import style from './PageMain.scss';

class TempMonitor extends Component {
    constructor(props) {
        super(props);
        this.state = {tempValue: 0};
    }

    componentDidMount() {
        globalVar.updateTempLabel = (data) => this.setState({tempValue: data});
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

class GraphLayer extends Component {
    constructor(props) {
        super(props);
        this.state = {dataPoints: []};
        this.drawGraph = this.drawGraph.bind(this);
    }

    drawGraph() {
        let canvas = this.canvas;
        let context = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.strokeStyle = this.props.strokeStyle ? this.props.strokeStyle : 'gray';
        context.lineWidth = 3;

        let arr = this.state.dataPoints;

        // var lines = 200,
        //     frag = canvas.width / lines,
        //     scale = canvas.height / 2;
        // context.moveTo(0, scale);
        // for (let i = 0; i < lines; i++) {
        //     let sine = Math.sin(2*3.141592 * i/lines)*scale;
        //     context.lineTo(i*frag, -sine+scale);
        // }

        if (arr.length === 0) {
            console.log("empty current points array");
            return;
        }

        const fullPeriod = 20; // размерность времени всей ширины графика(в секундах)
        const maxTemp = 220; // максимальная температура в градусах цельсия(определяет высоту графика)
        const lastTime = arr[arr.length - 1].time;

        let firstPoint = true;
        let firstPointTime = 0;
        for (let i = 0; i < arr.length; i++) {
            let data = arr[i];
            if ((lastTime - data.time) > fullPeriod) { continue; } // слишком старые данные не рисуем

            if (firstPoint) { firstPointTime = data.time; }

            let x = ((data.time - firstPointTime) / fullPeriod) * canvas.width;
            let y = (1 - data.temp/maxTemp) * canvas.height;

            if (firstPoint) { context.moveTo(x, y); firstPoint = false; }
            else { context.lineTo(x, y); }
        }
        context.stroke();
    }

    componentDidUpdate() {
        this.drawGraph();
    }
    componentDidMount() {
        this.drawGraph();
        window.addEventListener("resize", this.drawGraph);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.drawGraph);
    }

    render() {
        let className = style.graphLayer + (this.props.superClass ? (" " + this.props.superClass) : "");
        return <canvas id={this.props.id} className={className} ref={(domNode) => {this.canvas = domNode;}}/>
    }
}

class GraphView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        globalVar.updateRealData = (newData) => {
            if (this._realMeasureGraph) {
                let arr = this._realMeasureGraph.state.dataPoints;
                if (arr.length > 100) { arr.shift(); } // удаляем устаревшие измерения температуры
                arr.push(newData);
                this._realMeasureGraph.forceUpdate();
            }
        };
    }

    render() {
        return <div className={style.graphView}>
            <GraphLayer id='backLayer' superClass={style.backLayer}/>
            <GraphLayer id='layerIdeal'/>
            <GraphLayer id='layerReal' strokeStyle={'#ff5a88'} ref={(node) => {this._realMeasureGraph = node;}}/>
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
