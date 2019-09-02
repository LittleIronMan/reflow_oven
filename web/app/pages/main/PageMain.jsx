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

class GraphView extends Component {
    constructor(props) {
        super(props);
        this.drawGraph = this.drawGraph.bind(this);
    }

    drawGraph() {
        var canvas = document.getElementById("layerIdeal");
        var context = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.strokeStyle = '#ff5a88';

        // var lines = 200,
        //     frag = canvas.width / lines,
        //     scale = canvas.height / 2;
        // context.moveTo(0, scale);
        // for (let i = 0; i < lines; i++) {
        //     let sine = Math.sin(2*3.141592 * i/lines)*scale;
        //     context.lineTo(i*frag, -sine+scale);
        // }

        if (currentPoints.length === 0) {
            console.log("empty current points array");
            return;
        }

        const fullPeriod = 20; // размерность времени всей ширины графика(в секундах)
        const maxTemp = 220; // максимальная температура в градусах цельсия(определяет высоту графика)
        const lastTime = currentPoints[currentPoints.length - 1].time;

        let firstPoint = true;
        let firstPointTime = 0;
        for (let i = 0; i < currentPoints.length; i++) {
            let data = currentPoints[i];
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
        graph.update = () => this.drawGraph();
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.drawGraph);
    }

    render() {
        return <div className={style.graphView}>
            <canvas id="backLayer" className={style.graphLayer + " " + style.backLayer}> </canvas>
            <canvas id="layerIdeal" className={style.graphLayer}> </canvas>
            <canvas id="layerReal" className={style.graphLayer}> </canvas>
        </div>
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
