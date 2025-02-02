import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "../constants/colors";
// icons
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons, FontAwesome, AntDesign  } from '@expo/vector-icons';  

const Settings = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const getData = () => {
    try {
      AsyncStorage.getItem("body").then((value) => {
        if (value != null) {
          let body = JSON.parse(value);
          setToken(body.token);
          setUserId(body.user.id);
          setAvatar(body.user.haveAvatar);
          setName(body.user.name);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    avatar !== "" && name !== "" && userId !== "" && getAvatar();
  }, [avatar, name, userId]);

  const getAvatar = () => {
    fetch("http://91.227.2.183:5002/avatars_rateit/" + userId)
      .then((response) => response.text())
      .then((response) => {
        setUserAvatar(response);
      });
  };

  const resetEmail = () => {
    fetch("http://91.227.2.183:443/user/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: "token",
        userId: 40891190,
        mode: 2,
        value: newEmail,
      }),
    }).then((response) => {
      if (response.status === 200) {
        alert("Pomyślnie zmieniono avatar");
      } else {
        console.log("-------------------------err-------------");
        console.log(token);
        console.log(userId);
      }
    });
  };

  const changeName = () => {
    fetch("http://91.227.2.183:443/user/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        id: userId,
        mode: 0,
        value: newName,
      }),
    }).then((response) => {
      if (response.status === 200) {
        alert("Pomyślnie zmieniono nazwe");
      } else {
        console.log("-------------------------err-------------");
        console.log(token);
        console.log(userId);
      }
    });
  };

  const changeImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      width: 500,
      height: 500,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    let imageUri = result ? `data:image/jpg;base64,${result.base64}` : null;
    imageUri && console.log({ uri: imageUri.slice(0, 100) });

    if (!result.cancelled) {
      fetch("http://91.227.2.183:443/user/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          id: userId,
          mode: 3,
          value: result.base64.toString(),
        }),
      }).then((response) => {
        console.log(response);
        if (response.status === 200) {
          alert("Pomyślnie zmieniono avatar");
        } else {
          response.status;
          console.log("-------------------------err-------------");
          console.log(result.base64);
        }
      });
    }
  };

  const logOut = async()=>
  {
    try {
      await AsyncStorage.removeItem('body')
    } catch(e) {
  
    }
    console.log('Done.')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={styles.container}
      >
        <View style={{ width: "100%", marginTop: 15, paddingHorizontal: 20}}>
          <View style={styles.header}>
            <Text style={styles.title}>Ustawienia</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionLegend}>
              <Text style={styles.sectionLegendText}>User</Text>
            </View>
            <View style={styles.sectionContent}>
              <TouchableOpacity
                onPress={changeImage}
                style={styles.sectionContainer}
              >
                <Image
                  style={styles.avatar}
                  source={{
                    uri: `data:image/jpeg;base64,${userAvatar}`,
                  }}
                />
                <Text style={styles.sectionTitle}>Zmień avatar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionContainer}>
          
            <TextInput placeholder="Zmień nazwę użytkownika" onChangeText={setNewName}
        value={newName}/>
        <TouchableOpacity
            onPress={changeName}
            
          >
          </TouchableOpacity>
          </View>
                
          

          <TouchableOpacity style={styles.sectionContainer}>
            <FontAwesome name="facebook-square" size={24} color={Colors.lessLightGreen} />
            <Text style={styles.sectionTitle}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sectionContainer}>
            <AntDesign name="instagram" size={24} color={Colors.lessLightGreen} />
            <Text style={styles.sectionTitle}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sectionContainer}>
          <Ionicons name="document-text-outline" size={24} color={Colors.lessLightGreen} />
            <Text style={styles.sectionTitle}>Regulamin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sectionContainer}>
            <MaterialIcons name="security" size={24} color={Colors.lessLightGreen} />
            <Text style={styles.sectionTitle}>Polityka prywatności</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logOut} onPress={logOut}>
            <Text style={{color: 'white',textAlign: 'center'}}>Wyloguj się</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  userInfo: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 300,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.lessLightGreen
  },
  sectionContainer: {
    flexDirection: "row",
    height: 44,
    justifyContent: "space-between",
    backgroundColor: Colors.lightGreen,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10
  },
  socialMediaImage: {
    width: 25,
    height: 25,
    marginRight: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  header: {
    flexDirection: 'row'
  },
  logOut: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    color: 'white',
    height: 44,
    justifyContent: 'center',
    alignContent: 'center'
  },
  sectionLegendText: {
    color: Colors.lessLightGreen,
    textTransform: 'capitalize'
  }
});
