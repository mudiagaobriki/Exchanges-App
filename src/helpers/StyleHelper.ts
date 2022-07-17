import {StyleSheet} from "react-native";
import {Colors} from "../constants";

export const globalStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    flex: 1,
    paddingHorizontal: 30
  },
  inputBox: {
    marginTop: 20,
  },
  input: {
    paddingHorizontal: 10,
    borderColor: "#FCFBFC",
    backgroundColor: "#FCFBFC",
  },
  textareaContainer: {
    borderColor: "#FCFBFC",
    backgroundColor: "#FCFBFC",
    height: 80,
    padding: 5,
    borderWidth: 1,
    borderRadius: 12,
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    color: "gray",
  },
  textarea: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderColor: "#FCFBFC",
    // backgroundColor: "#FCFBFC",
    textAlignVertical: "top", // hack android
    height: 80,
    fontSize: 14,
    color: "#333",
  },
  dropdown:{
    paddingHorizontal: 10,
    borderColor: "#FCFBFC",
    backgroundColor: "#FCFBFC",
    zIndex: 10,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  dropdownPlaceholder: {
    paddingHorizontal: 10
  },
  button: {
    marginVertical: 24,
    backgroundColor: "#E8FFF1",
    borderColor: "#E8FFF1",
    color: Colors.text_success,
    borderRadius: 20,
    paddingVertical: 20,
    width: "100%",
    alignSelf: "center",
    fontSize: 22,
  },
  buttonText: {
    color: Colors.text_success,
    fontWeight: "bold",
    textAlign: "center",
  }
})
