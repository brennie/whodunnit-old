import {replace as replaceHistory} from 'react-router-redux';
import {connect} from 'react-redux';

import Home from './home';


const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  replaceHistory: location => dispatch(replaceHistory(location)),
});

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default HomeContainer;
