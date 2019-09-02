import ReactDOM from 'react-dom';
import MainPage from 'pages/main/PageMain.jsx';
import 'styles/main.scss';

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(
    <MainPage/>,
    document.getElementById('app')
);
