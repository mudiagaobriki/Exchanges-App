import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { Colors } from "../constants";
import { t } from "../localization/transfy";

export const NjConfirmPaymentModal = (props: any = {}) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>modalVisible = {props.modalVisible ? "YES" : "NO"}</Text>
      <Modal isVisible={props.modalVisible}>
        <View style={styles.modalView}>
          <View style={{ height: "auto" }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                props.setModalVisible(false);
                console.log("props.setVisible", props.setModalVisible);
              }}
            >
              <Icon
                name="close"
                size={24}
                color="#131A22"
                style={{ alignItems: "flex-end" }}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitleText}>
              {props.heading || "Confirm Payment"}
            </Text>
            {props.title ? (
              <Text style={styles.modalSubTitleText}>{props.title}</Text>
            ) : (
              <></>
            )}
            {props.subTitle ? (
              <Text style={styles.modalSubTitleBoldText}>{props.subTitle}</Text>
            ) : (
              <></>
            )}
            <View style={styles.modalInfoTable}>
              <ScrollView>
                {(props.data || []).map((v: React.ReactNode, i: number) => {
                  return (
                    <View key={"dkv-" + i} style={{ flexDirection: "row" }}>
                      <View>
                        {/* @ts-ignore */}
                        <Text style={styles.paymentText}>
                          {String(v?.title || " ")}
                        </Text>
                      </View>
                      <View style={{ width: 20 }} />
                      <View style={{ flex: 1 }}>
                        {/* @ts-ignore */}
                        <Text style={styles.paymentTextDetail}>
                          {String(v?.value || " ")}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View>
                <Text style={styles.paymentText}>
                  {props.totalPaymentText || "Total Payment"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: Colors.text_success,
                    fontSize: 18,
                    fontFamily: "Rubik-Regular",
                    textAlign: "right",
                  }}
                >
                  {props.totalPayment || ""}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalSubmitButtonBox}
              onPress={() => props.onModalSubmit()}
            >
              <Text style={styles.modalSubmitButton}>{t("Confirm")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    height: "auto",
    padding: 30,
  },
  modalTitleText: {
    color: "#131A22",
    fontSize: 20,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalSubTitleText: {
    color: "#B8B8B8",
    fontSize: 14,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 30,
  },
  modalSubTitleBoldText: {
    color: "#000",
    fontSize: 12,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 20,
  },
  modalInfoTable: {
    flexDirection: "row",
    borderStyle: "dashed",
    borderBottomWidth: 2,
    borderColor: "#B8B8B8",
    marginTop: 30,
    paddingBottom: 20,
  },
  modalSubmitButtonBox: {
    marginVertical: 30,
    backgroundColor: "#E8FFF1",
    borderColor: "#E8FFF1",
    color: Colors.text_success,
    borderRadius: 20,
    height: 55,
    width: "100%",
    alignSelf: "center",
    fontSize: 22,
  },
  modalSubmitButton: {
    color: Colors.text_success,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20,
  },
  paymentText: {
    color: "#B8B8B8",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    fontWeight: "normal",
    lineHeight: 30,
  },
  paymentTextDetail: {
    color: "#131A22",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    fontWeight: "normal",
    lineHeight: 30,
    textAlign: "right",
  },
});
