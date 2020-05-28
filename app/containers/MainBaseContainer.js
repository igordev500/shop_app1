import React from "react";
import { Container } from "native-base";
import NavBar from "./NavBar";
import ProgressLoader from "../components/ProgressLoader";
import { EDColors } from "../assets/Colors";
import { netStatusEvent } from "../utils/NetworkStatusConnection";


export default class MainBaseContainer extends React.Component {
  componentDidMount() {
    // netStatusEvent(status => {
   
    // });
  }
  
  render() {
    return (
      <Container>
        {this.props.loading ? <ProgressLoader /> : null}
        <Container style={{ backgroundColor: EDColors.backgroundDark }}>
          {this.props.children}
        </Container>
      </Container>
    );
  }
}

