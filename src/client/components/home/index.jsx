import {push as pushHistory} from 'react-router-redux';
import {connect} from 'react-redux';

import Home from './home';


const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  pushHistory: location => dispatch(pushHistory(location)),
});

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default HomeContainer;
