/*Organization Name : Redleaf Technologies Private Limited
Developer NAme : Janani Shruthi */
import React, { useState, useEffect, useRef } from "react";
import bar from "./src/Texas.json"; //json file consisting of the area
import MapView, { Callout, Geojson, Marker } from "react-native-maps";
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { PROVIDER_GOOGLE } from "react-native-maps";

const App = () => {
  const [region, setRegion] = useState({    //Location of Region of Interest
    latitude: 32.48518673256908,
    longitude: -94.84525657357835,
    latitudeDelta: 20,
    longitudeDelta: 20,
    zoom: 5
  });
 
 const regex =/(<([^>]+)>)/gi; // To remove html tags from the json file
  const [marker, setMarker] = useState({ lat: 31.9686, lng: 99.9018, location: "" });  //Primary Location For the Marker
  const [markers, setMarkers] = useState({ lat: 31.9686, lng: 99.9018, location: "" })

  const b1 = bar.features.filter(x => x.properties.condition == "Construction") //Filter based on Construction
  const b11 = { "type": "FeatureCollection", "features": b1 }

  const a2 = bar.features.filter(x => x.properties.condition == "Damage")//Filter based on Damage
  const a21 = { "type": "FeatureCollection", "features": a2 }

  const a3 = bar.features.filter(x => x.properties.condition == "Accident")//Filter based on Accident
  const a31 = { "type": "FeatureCollection", "features": a3 }

  const a4 = bar.features.filter(x => x.properties.condition == "Other") //Filter based on Other
  const a41 = { "type": "FeatureCollection", "features": a4 }

  
  useEffect(() => {    //Provide Access to User Location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissions to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      setPin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,


      })
    })();
  }, []);

  return (

    <View style={{ marginTop: 50, flex: 1 }}>
      <GooglePlacesAutocomplete    //Google Places Search bar using Autocomplete 
        placeholder='Search here'
        fetchDetails={true}
        autoFocus={false}
        returnKeyType={'next'}
        keyboardAppearance={'light'}
        listViewDisplayed={true}
        showsCompass={true}
        nearbyPlacesAPI='GooglePlacesSearch'
        predefinedPlacesAlwaysVisible={true}
        renderDescription={row => row.description}
        clearButtonMode={'always'}
        GooglePlacesSearchQuery={{
          rankby: "distance"
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data);
          console.log(data.structured_formatting.main_text);

          setMarker({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.009,
            longitudeDelta: 0.009,
            location: data.structured_formatting.main_text,

          })
          setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.009,
            longitudeDelta: 0.009,

          })

        }}
        getDefaultValue={() => ''}
        query={{
          key: 'AIzaSyAGianQKRJUgXL-X8U7BlnOemWS_UnK0Gg',
          language: 'en',
          types: 'establishment',
          radius: 30000,
          location: `${region.latitude},${region.longitude}`,

        }}

        styles={{  //style for Seach Bar 
          container: {
            flex: 0,
            borderColor: '#000000'

          },
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth: 0
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: '#5d5d5d',
            fontSize: 16
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          },
          poweredContainer: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderColor: '#c8c7cc',
            borderTopWidth: 0.5,
          },
          powered: {},
          listView: {},
          row: {
            backgroundColor: '#FFFFFF',
            padding: 13,
            height: 44,
            flexDirection: 'row',
          },
          separator: {
            height: 0.5,
            backgroundColor: '#c8c7cc',
          },
          description: {},
          loader: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 20,
          },
        }}
      />

      <MapView
        initialRegion={{
          latitude: 32.48518673256908,
          longitude: -94.84525657357835,
          latitudeDelta: 0.9,
          longitudeDelta: 0.9,
        }}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={region}
        zoomEnabled   // To enable zoom in Zoom out widget
        zoomControlEnabled
        showsMyLocationButton={true}  // To enable to user location widget
        showsUserLocation={true}
        showsCompass={true}  //To enable Compass on the map
        toolbarEnabled={true}
        debounce={200}
      >
        <Marker   //Marker which navigates to the places searched on map
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}

        />

        <MapView.Marker   //Marker To display the asssociated feature attributes for JSON data
          coordinate={{
            latitude: region.latitude, longitude: region.longitude

          }}

        >

          <MapView.Callout > 
           <ScrollView showsVerticalScrollIndicator={true} >
              <View><Text>GLOBALID :{markers.globalid}</Text></View>
              <View><Text>Condition :{markers.cond}</Text></View>
              <View><Text>Description :{markers.desp}</Text></View>
              <View><Text>Detour flag :{markers.detour}</Text></View>
              <View><Text>Route Name :{markers.rn}</Text></View>
              <View><Text>Travel Direction :{markers.td}</Text></View>
           </ScrollView>

          </MapView.Callout>



        </MapView.Marker>

        <Geojson    //To add Geojson file which includes Texas(Area of Interest) having road condition as construction

          geojson={b11}
          color="#ef5c1a"
          strokeWidth={2}
          strokeColor="#ef5c1a"

          onPress={(data, details = null) => {
            console.log(bar);
            setMarkers({
              latitude: data.coordinates.latitude,
              longitude: data.coordinates.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
              globalid: data.feature.properties.GLOBALID,
              cond: data.feature.properties.condition,
              detour: data.feature.properties.detour_flag,
              desp:data.feature.properties.description.replace(regex,''),
              td: data.feature.properties.travel_direction,
       
            })
            setRegion({
              latitude: data.coordinates.latitude,
              longitude: data.coordinates.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,

            })
        
          }}


        />
        <Geojson    //To add Geojson file which includes Texas(Area of Interest) having road condition as Damage
          geojson={a21}
          color="#9d00ca"
          strokeColor="#9d00ca"
          strokeWidth={2}
          onPress={(data, details = null) => {
            setMarkers({
              latitude: data.coordinates.latitude,
              longitude: data.coordinates.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
              globalid: data.feature.properties.GLOBALID,
              cond: data.feature.properties.condition,
              detour: data.feature.properties.detour_flag,
              desp:data.feature.properties.description.replace(regex,''),
              td: data.feature.properties.travel_direction,

            })
            setRegion({
              latitude: data.coordinates.latitude,
              longitude: data.coordinates.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,

            })
          }}


        />
        <Geojson    //To add Geojson file which includes Texas(Area of Interest) having road condition as Accidents
          geojson={a31}
          color="#c60005"
          strokeColor="#c60005"
          strokeWidth={2}
          onPress={(data, details = null) => {
            setMarkers({
              latitude: data.coordinates.latitude,
              longitude: data.coordinates.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
              globalid: data.feature.properties.GLOBALID,
              cond: data.feature.properties.condition,
              detour: data.feature.properties.detour_flag,
              desp:data.feature.properties.description.replace(regex,''),
              td: data.feature.properties.travel_direction,

            })
            setRegion({
              latitude: data.coordinates.latitude,
              longitude: data.coordinates.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,

            })
          }}


        />
        <Geojson    //To add Geojson file which includes Texas(Area of Interest) having road condition as Others
          geojson={a41}
          color="#fcd400"
          strokeColor="#fcd400"
          strokeWidth={2}
          onPress={(data, details = null) => {
            setMarkers({
              latitude: data.coordinates.latitude,
              longitude: data.coordinates.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
              globalid: data.feature.properties.GLOBALID,
              cond: data.feature.properties.condition,
              detour: data.feature.properties.detour_flag,
              desp:data.feature.properties.description.replace(regex,''),
              td: data.feature.properties.travel_direction,

            })
            setRegion({
              latitude: data.coordinates.latitude,
              longitude: data.coordinates.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,

            })
          }}


        />

      </MapView>

    </View>
  );
};

export default App;