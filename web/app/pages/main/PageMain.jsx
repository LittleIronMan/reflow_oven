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
        var canvas = document.getElementById("surface");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        var lines = 200,
            frag = canvas.width / lines,
            scale = canvas.height / 2;
        console.log(`Canvas client size: ${canvas.clientWidth}x${canvas.clientHeight}`);
        console.log(`Canvas size: ${canvas.width}x${canvas.height}`);
        console.log("frag: ", frag);
        console.log("scale: ", scale);

        context.moveTo(0, scale);
        for (var i = 0; i < lines; i++) {
            var sine = Math.sin(2*3.141592 * i/lines)*scale;

            context.lineTo(i*frag, -sine+scale);
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
        return <canvas id="surface" className={style.graphView}>

        </canvas>
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
