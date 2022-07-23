import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeContext } from "../../theme";

let loadingView: LoadingLayout;

export const LoadingManager = {
  showLoading: () => loadingView?.show(),
  hideLoading: () => loadingView?.hide(),
  setLoadingView: (view: LoadingLayout) => (loadingView = view),
};

export class LoadingLayout extends React.Component {
  state = {
    isShowed: false,
  };

  show = () => this.setState({ isShowed: true });
  hide = () => this.setState({ isShowed: false });

  render() {
    if (!this.state.isShowed) {
      return null;
    }
    return (
      <View style={[StyleSheet.absoluteFill, styles.container]}>
        <ThemeContext.Consumer>
          {(theme) => (
            <ActivityIndicator size="large" color={theme.colors.primaryColor} />
          )}
        </ThemeContext.Consumer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00000010",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
});
