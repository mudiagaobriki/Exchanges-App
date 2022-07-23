import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, {useEffect, useState} from "react";
import {WalletService} from "../services";
import {useNavigation} from "@react-navigation/native";
import {NavigationNames} from "../navigations";

export default function BeneficiaryList() {

  const [beneficiaries, setBeneficiaries] = useState([])

  const navigation = useNavigation()

  useEffect(() => {
    WalletService.getAllBeneficiaries()
        .then(res => {
          console.log("Beneficiaries list: ", res)
          setBeneficiaries(res)
        })
  },[])


  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      <ScrollView>
        <View style={{ marginBottom: 40 }}>
          <Text style={{ margin: 10 }}>Deposit Options</Text>
          {
            beneficiaries.map((b,index) =>
                <TouchableOpacity style={styles.btnContainer} key={index}>
                  <View style={styles.beneficiary}>
                    <View style={styles.name}>
                      <Text style={styles.title}>{b.account_name}</Text>
                      <Text style={styles.account}>{b.bank_name}: {b.account_number}</Text>
                    </View>
                    <Text style={{ fontSize: 13, marginTop: 10, fontWeight: "500" }}>
                      {b.currency}
                    </Text>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.delete}>
                      <Text style={styles.actiontext}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.edit}
                    onPress={() => navigation.navigate(NavigationNames.NjBeneficiaryScreen ,{beneficiary: b, edit: true})}>
                      <Text style={styles.actiontext}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.add}>
                      <Text style={styles.actiontext}>Add Cash</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
            )
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "white", flex: 1, paddingHorizontal: 30 },
  btnContainer: {
    backgroundColor: "whitesmoke",
    borderRadius: 20,
    margin: 5,
    padding: 15,
  },
  beneficiary: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 13,
  },
  title: {
    fontSize: 13,
    marginBottom: 10,
    fontWeight: "500",
  },
  account: {
    fontSize: 13,
    fontWeight: "400",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 20,
  },
  actiontext: {
    color: "white",
  },
  delete: {
    backgroundColor: "red",
    padding: 10,
    width: 100,
    alignItems: "center"
  },
  edit: {
    backgroundColor: "black",
    padding: 10,
    width: 100,
    alignItems: "center"
  },
  add: {
    backgroundColor: "#41CC78",
    padding: 10,
    width: 100,
    alignItems: "center"
  },
});
